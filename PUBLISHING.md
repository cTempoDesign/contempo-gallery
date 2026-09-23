# Publishing

Releases are automatic. `.github/workflows/publish.yml` runs lint, typecheck, tests and build on every pull request and every push to `master`.

## Releasing a new version

1. Bump the version in `package.json` (`npm version patch|minor|major --no-git-tag-version`) in your PR.
2. Merge to `master`.

If no `v<version>` tag exists yet, the workflow:

- builds `dist/`
- commits it on top of `master` with the build scripts and devDependencies removed (this commit is only reachable from the tag; `master` is untouched)
- pushes the tag `v<version>` and creates a GitHub Release with generated notes

A push without a version bump runs the checks and releases nothing. No tokens, secrets or npm account are involved; the workflow uses GitHub's built-in token.

## Installing in an app

```bash
npm install "github:cTempoDesign/contempo-gallery#semver:^1.2.0"
```

Because the tagged commit already contains `dist/` and has no build scripts, npm just copies the files. Apps pick up new minor and patch releases with `npm update @ctempodesign/contempo-gallery`; a new major version needs the range changed.

## Testing a build locally

```bash
npm run build
npm pack                     # creates ctempodesign-contempo-gallery-<version>.tgz
cd /path/to/app && npm install /path/to/ctempodesign-contempo-gallery-<version>.tgz
```
