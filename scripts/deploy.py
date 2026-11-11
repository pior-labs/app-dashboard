"""Deploy a verified static artifact into Caddy's existing bind-mounted directory."""
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import tarfile
import tempfile
from datetime import datetime, timezone

from release import validate_release


def command(*args, **kwargs):
    return subprocess.run(args, check=True, text=True, **kwargs)


def write_json(path, record):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(record, indent=2) + '\n')
    temporary.replace(path)


def unpack(archive, destination):
    with tarfile.open(archive, 'r:gz') as bundle:
        for entry in bundle:
            path = PurePosixPath(entry.name)
            if path.is_absolute() or '..' in path.parts or not (entry.isdir() or entry.isfile()):
                raise ValueError('Static archives must contain only relative regular files and directories')
            target = destination.joinpath(*path.parts)
            if entry.isdir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with bundle.extractfile(entry) as source, target.open('wb') as output:
                    shutil.copyfileobj(source, output)
    if not (destination/'index.html').is_file():
        raise ValueError('Static artifact has no index.html')


def deploy():
    os.umask(0o077)
    state = Path(os.environ['DEPLOY_DIR'])
    site = Path(os.environ.get('DASHBOARD_SITE_DIR', '/srv/homepage-dashboard'))
    for path in (state, site):
        if not path.is_absolute() or len(path.parts) < 3 or path.resolve() != path:
            raise ValueError('State and static-site directories must be dedicated absolute paths without symlinks')
    if state == site or site in state.parents or state in site.parents:
        raise ValueError('Deployment state must be outside the served site directory')
    release = json.loads(Path('release.json').read_text())
    validate_release(release, os.environ['GITHUB_REPOSITORY'], os.environ['EXPECTED_RUN_ID'], os.environ['EXPECTED_ATTEMPT'], os.environ['EXPECTED_SHA'])
    archive = Path('site.tar.gz')
    if hashlib.sha256(archive.read_bytes()).hexdigest() != release['files']['site.tar.gz']:
        raise ValueError('Static artifact does not match the verified release')
    state.mkdir(parents=True, exist_ok=True)
    site.mkdir(parents=True, exist_ok=True)
    runtime = Path(tempfile.mkdtemp(prefix=f"{release['run_id']}-{release['run_attempt']}-",dir=state))
    record = {**release,'runtime_dir':str(runtime),'started_at':datetime.now(timezone.utc).isoformat()}
    write_json(state/'attempt.json',{**record,'status':'deploying'})
    try:
        unpack(archive,runtime/'site')
        shutil.copyfile(archive,runtime/'site.tar.gz')
        # Keep the directory inode: Caddy's Docker bind mount would keep serving
        # the old inode if the entire host directory were replaced by a symlink.
        command('rsync','-a','--chmod=D755,F644','--delete',str(runtime/'site')+'/',str(site)+'/')
        probe=runtime/'ingress.html'
        command('curl','--fail','--silent','--show-error','--retry','10','--retry-delay','3','--retry-all-errors','--max-time','15','--output',str(probe),'https://szarans.ca/')
        if probe.read_bytes() != (runtime/'site/index.html').read_bytes():
            raise ValueError('Ingress is not serving the selected static build')
        current=state/'current.json'
        if current.exists():write_json(state/'previous.json',json.loads(current.read_text()))
        record.update(status='healthy',completed_at=datetime.now(timezone.utc).isoformat())
        write_json(current,record)
        write_json(state/'attempt.json',record)
    except Exception:
        write_json(state/'attempt.json',{**record,'status':'failed'})
        raise
    with open(os.environ['GITHUB_STEP_SUMMARY'],'a') as summary:
        summary.write(f"Deployed static commit `{release['sha']}` from CI {release['run_id']}, attempt {release['run_attempt']}.\n")


if __name__=='__main__':deploy()
