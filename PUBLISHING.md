# Publishing

`@ctempodesign/contempo-gallery` publishes to GitHub Packages automatically via `.github/workflows/publish.yml`.

## Releasing a new version

1. Bump the version in `package.json` (`npm version patch|minor|major --no-git-tag-version`).
2. Merge to `master`.

On every push to `master` the workflow lints, typechecks, tests and builds. If the `package.json` version is not already published, it runs `npm publish` using the built-in `GITHUB_TOKEN`; otherwise it skips publishing. Pull requests run the same checks without publishing.

Versions are immutable: to release a change, bump the version.

## Installing in another project

Add `.npmrc` to the consuming project:

```
@ctempodesign:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

`GITHUB_TOKEN` needs `read:packages` scope. Locally, use a classic personal access token; on Vercel, add it as an environment variable; in GitHub Actions of another repo, grant that repo access under the package's settings (Package settings → Manage Actions access) and use `secrets.GITHUB_TOKEN`.

```bash
npm install @ctempodesign/contempo-gallery
```

## Testing a build locally

```bash
npm run build
npm pack                     # creates ctempodesign-contempo-gallery-<version>.tgz
cd /path/to/app && npm install /path/to/ctempodesign-contempo-gallery-<version>.tgz
```
