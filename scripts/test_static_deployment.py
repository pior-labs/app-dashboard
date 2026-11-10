"""Exercise static deployment without contacting ingress or changing served files."""
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import tempfile
import unittest
from unittest.mock import patch

import deploy
from test_release import MANIFEST, REPOSITORY, SHA


class StaticDeployment(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)
        old=Path.cwd();os.chdir(self.root);self.addCleanup(os.chdir,old)
        self.site=self.root/'served';self.state=self.root/'state'
        data=b'<html>verified build</html>'
        with tarfile.open('site.tar.gz','w:gz') as bundle:
            entry=tarfile.TarInfo('./index.html');entry.size=len(data)
            bundle.addfile(entry,io.BytesIO(data))
        manifest={**MANIFEST,'files':{'site.tar.gz':hashlib.sha256(Path('site.tar.gz').read_bytes()).hexdigest()}}
        Path('release.json').write_text(json.dumps(manifest))
        env=patch.dict(os.environ,{'DEPLOY_DIR':str(self.state),'DASHBOARD_SITE_DIR':str(self.site),
                       'GITHUB_REPOSITORY':REPOSITORY,'EXPECTED_RUN_ID':'123','EXPECTED_ATTEMPT':'2',
                       'EXPECTED_SHA':SHA,'GITHUB_STEP_SUMMARY':str(self.root/'summary')})
        env.start();self.addCleanup(env.stop)
        old_umask=os.umask(0o022);self.addCleanup(os.umask,old_umask)
        self.commands=[]

    def command(self,*args,**kwargs):
        self.commands.append(args)
        if args[0]=='rsync':shutil.copytree(args[-2],args[-1],dirs_exist_ok=True)
        if args[0]=='curl':Path(args[args.index('--output')+1]).write_bytes((self.site/'index.html').read_bytes())
        return subprocess.CompletedProcess(args,0)

    def test_verified_build_is_served_and_records_only_after_probe(self):
        with patch.object(deploy,'command',side_effect=self.command):deploy.deploy()
        current=json.loads((self.state/'current.json').read_text())
        self.assertEqual(current['sha'],SHA)
        self.assertEqual((self.site/'index.html').read_text(),'<html>verified build</html>')
        self.assertTrue(any(args[0]=='rsync' and '--delete' in args for args in self.commands))
        self.assertTrue(any(args[0]=='curl' for args in self.commands))

    def test_checksum_failure_cannot_change_site(self):
        Path('site.tar.gz').write_bytes(b'tampered')
        with patch.object(deploy,'command') as command,self.assertRaises(ValueError):deploy.deploy()
        command.assert_not_called()
        self.assertFalse(self.site.exists())

    def test_failed_probe_keeps_last_success_record(self):
        self.state.mkdir();previous={'sha':'c'*40};(self.state/'current.json').write_text(json.dumps(previous))
        def fail(*args,**kwargs):
            if args[0]=='curl':raise subprocess.CalledProcessError(1,args)
            return self.command(*args,**kwargs)
        with patch.object(deploy,'command',side_effect=fail),self.assertRaises(subprocess.CalledProcessError):deploy.deploy()
        self.assertEqual(json.loads((self.state/'current.json').read_text()),previous)
        self.assertEqual(json.loads((self.state/'attempt.json').read_text())['status'],'failed')

    def test_archive_traversal_and_symlinks_are_rejected(self):
        for name,kind in [('../escape',tarfile.REGTYPE),('/escape',tarfile.REGTYPE),('link',tarfile.SYMTYPE)]:
            with tarfile.open('unsafe.tar.gz','w:gz') as bundle:
                entry=tarfile.TarInfo(name);entry.type=kind;entry.linkname='/etc/passwd';bundle.addfile(entry)
            with self.subTest(name=name),self.assertRaises(ValueError):deploy.unpack(Path('unsafe.tar.gz'),self.root/'extract')


if __name__=='__main__':unittest.main()
