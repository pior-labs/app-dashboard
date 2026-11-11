# Homepage Dashboard

A static single-page link dashboard for self-hosted apps and infra tools.

Links are loaded by the browser from `/config.json` at runtime. The build is generic:
deploy the same `dist/` directory everywhere and provide a different mounted `config.json`
per server.

## Development

```bash
pnpm install
pnpm dev
```

For local links, copy `config.example.json` to `config.json` and edit it. That file is ignored by git.
The Vite dev server exposes it at `/config.json`. With no config present, the app starts as a blank slate and
shows an empty state.

## Build

```bash
pnpm build
```

The static output is written to `dist/` and can be served by any static file server.

## Runtime config

Create a `config.json` next to the deployed static app, or mount it so Caddy serves it at `/config.json`.
Changing links only requires editing that file and refreshing the browser; no rebuild is needed.

Shape:

```json
{
  "title": "homebase",
  "links": [
    {
      "name": "Jellyfin",
      "description": "Media streaming",
      "href": "https://jellyfin.example.com",
      "icon": "Film",
      "group": "Media",
      "status": "online",
      "newTab": true
    }
  ]
}
```

Each service should use one canonical `href`. In environments using split-horizon DNS, the same hostname can
resolve to the appropriate private, Tailscale, or public route depending on where the client is connected. The
dashboard does not probe alternate URLs or need to know which network path is in use.

See `config.example.json` for a complete dummy config. Real `config.json` files are ignored and should not be
committed.

## Deployment

Build once, copy `dist/` to the static web root, and mount a hand-edited config file separately.

The included `Caddyfile` expects:

- Static build files at `/srv/homepage-dashboard`
- Runtime config mounted at `/config/config.json`

Example Docker run using the stock Caddy image:

```bash
pnpm build
docker run --rm -p 8080:80 \
  -v "$PWD/dist:/srv/homepage-dashboard:ro" \
  -v "/path/on/server/config.json:/config/config.json:ro" \
  -v "$PWD/Caddyfile:/etc/caddy/Caddyfile:ro" \
  caddy:2
```

On a fresh server, start with:

```bash
cp config.example.json /path/on/server/config.json
```

Then edit `/path/on/server/config.json` with the canonical URL for each service. DNS should handle routing that
hostname appropriately for LAN, Tailscale, or any other supported network path.

## Self-hosted runner deploy

Pull requests and main pushes run CI on GitHub-hosted runners. CI builds `dist/`
once, archives it, and records its SHA-256 in an attempt-specific release manifest.
After a successful main CI run, Deploy automatically transfers that exact static
artifact to the dedicated `homepage-dashboard` runner. Older completed builds
are skipped once main has moved, preventing an automatic rollback from a slow CI
run. Deployments share `dashboard-production` concurrency and never cancel a
running file sync.

Before merging this workflow migration, provision a private writable state
directory **outside** the served site. `DEPLOY_DIR` defaults to
`/srv/homepage-dashboard-releases`; set the repository variable to another
appropriate dedicated path if necessary. The runner needs Python 3, rsync, curl,
and write access to both that directory and `/srv/homepage-dashboard`. Runner
provisioning remains separate. No production Node installation is required.

For manual redeployment or rollback, dispatch Deploy on main with a successful
main CI run's full numeric ID from `/actions/runs/<ID>`, and its exact optional
`ci_run_attempt`. Only releases produced by the new CI are eligible; artifacts
expire after 90 days. Merge itself enables the automatic path, so satisfy runner
and directory requirements before merging.

The resolver checks workflow/run identity, conclusion, main ancestry and archive
checksum before using the production runner. Deployment rejects symlinks, path
traversal and mismatched archives, then synchronizes into the **existing site
directory**. Replacing that directory by a symlink could leave Caddy's bind mount
serving the old inode, so releases keep the live directory in place. A final
HTTPS check verifies the served index matches the selected build.

`current.json`, `previous.json`, and `attempt.json` live in the private state
directory, alongside retained release archives. Successful records change only
after ingress verification. A failed sync/probe may have partially changed the
served files; select the last healthy run/attempt to restore them. There is no
recorded legacy predecessor on the first migrated deployment. Clean old archives
only after retaining current/previous/attempted builds. This pipeline never
changes platform Caddy or runtime configuration.

The workflow does not write the runtime config. Keep the production config on the server at:

```text
/config/config.json
```
