# Publishing

`@ctempodesign/contempo-gallery` publishes to the public npm registry automatically via `.github/workflows/publish.yml`.

## Releasing a new version

1. Bump the version in `package.json` (`npm version patch|minor|major --no-git-tag-version`) in your PR.
2. Merge to `master`.

The workflow runs lint, typecheck, tests and build on every pull request and every push to `master`. On `master`, if the `package.json` version isn't on npm yet, it runs `npm publish`. A merge without a version bump runs the checks and publishes nothing.

Publishing uses npm **trusted publishing**: GitHub Actions proves its identity to npm with a short-lived OIDC token (`id-token: write`), so no npm token is stored in GitHub. npm also attaches a provenance attestation linking each version to the commit and workflow run that built it.

## One-time setup

npm only allows trusted publishing for a package that already exists, so the very first version is published by hand ([npm/cli#8544](https://github.com/npm/cli/issues/8544)).

1. On npmjs.com, create the free organization `ctempodesign` (avatar menu → **Add Organization**, choose the free/unlimited public packages plan).
2. Publish the first version from your machine (you'll be asked to sign in, with 2FA):
   ```bash
   git clone https://github.com/cTempoDesign/contempo-gallery && cd contempo-gallery
   npm login
   npm ci
   npm publish
   ```
3. On npmjs.com, open `@ctempodesign/contempo-gallery` → **Settings → Trusted Publisher → GitHub Actions** and enter:
   - Organization or user: `cTempoDesign`
   - Repository: `contempo-gallery`
   - Workflow filename: `publish.yml`
4. Recommended: on the same settings page, set **Publishing access** to "Require two-factor authentication and disallow tokens", so only this workflow can publish.

Only step 3 needs redoing, and only if the repository or workflow file is renamed.

## Installing in an app

```bash
npm install @ctempodesign/contempo-gallery
```

Apps pick up new minor and patch releases with `npm update @ctempodesign/contempo-gallery`. A new major version needs `npm install @ctempodesign/contempo-gallery@latest`.

## Testing a build locally

```bash
npm run build
npm pack                     # creates ctempodesign-contempo-gallery-<version>.tgz
cd /path/to/app && npm install /path/to/ctempodesign-contempo-gallery-<version>.tgz
```
