# Publishing Contempo Gallery to NPM

This guide explains how to publish the `contempo-gallery` package to npm so users can install it with `npm install contempo-gallery`.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/signup)
2. **NPM CLI**: Make sure you have npm installed (`npm --version`)
3. **Authentication**: Log into npm via CLI

## Step-by-Step Publishing Process

### 1. Login to NPM

```bash
npm login
```

Enter your npm username, password, and email when prompted.

### 2. Verify Package Configuration

Check that your package.json has the correct information:

```bash
# View current package info
npm run build
npm pack --dry-run
```

This shows exactly what files will be included in your published package.

### 3. Update Package Details (Important!)

Before publishing, update these fields in `package.json`:

```json
{
  "name": "contempo-gallery",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/contempo-gallery.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/contempo-gallery/issues"
  },
  "homepage": "https://github.com/yourusername/contempo-gallery#readme"
}
```

### 4. Check Package Name Availability

```bash
npm view contempo-gallery
```

If this returns an error, the name is available. If it returns package info, you'll need to choose a different name like:
- `@yourusername/contempo-gallery` (scoped package)
- `contempo-gallery-react`
- `your-contempo-gallery`

### 5. Test the Package Locally

Before publishing, test the built package:

```bash
# Build the package
npm run build

# Create a test tarball
npm pack

# This creates contempo-gallery-1.0.0.tgz
# You can install this locally to test:
cd /some/test/project
npm install /path/to/contempo-gallery-1.0.0.tgz
```

### 6. Publish to NPM

```bash
# For first-time publishing
npm publish

# For subsequent versions, update version first:
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0  
npm version major  # 1.0.0 -> 2.0.0
npm publish
```

### 7. Verify Publication

After publishing, verify it's available:

```bash
npm view contempo-gallery
```

And test installation:

```bash
cd /some/test/project
npm install contempo-gallery
```

## Using the Published Package

Once published, users can install and use your package:

### Installation

```bash
npm install contempo-gallery
```

### Usage

```tsx
import React from 'react';
import { ContempoGallery } from 'contempo-gallery';

const images = [
  {
    src: 'https://example.com/image1.jpg',
    alt: 'Image 1',
    caption: 'Beautiful landscape'
  }
  // ... more images
];

function App() {
  return <ContempoGallery images={images} columns={3} gap={16} />;
}
```

## Important Notes

### Package Name

⚠️ **Important**: The package name `contempo-gallery` might already be taken on npm. If so, you have these options:

1. **Use a scoped package**: `@yourusername/contempo-gallery`
2. **Choose a different name**: `contempo-image-gallery`, `contempo-react-gallery`, etc.
3. **Add your prefix**: `yourname-contempo-gallery`

### Version Management

- Follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`
- Use `npm version` commands to auto-increment versions
- Major: Breaking changes (2.0.0)
- Minor: New features, backwards compatible (1.1.0)
- Patch: Bug fixes (1.0.1)

### Files Included

The `files` array in package.json specifies what gets published:

```json
"files": [
  "dist"
]
```

This includes only the `dist/` folder, keeping the published package small.

### Pre-publish Hooks

The package is configured to automatically build before publishing:

```json
"scripts": {
  "prepublishOnly": "npm run build",
  "prepack": "npm run build"
}
```

## Troubleshooting

### Name Already Taken

If the package name is taken, update `package.json`:

```json
{
  "name": "@yourusername/contempo-gallery"
}
```

Then publish with:

```bash
npm publish --access public
```

### Permission Errors

Make sure you're logged in and have permission to publish:

```bash
npm whoami
npm login
```

### Build Errors

Ensure the package builds successfully before publishing:

```bash
npm run build
npm run typecheck
npm run lint
```

## After Publishing

1. **Update README**: Add installation instructions
2. **Create GitHub Release**: Tag the version on GitHub
3. **Update Documentation**: Keep examples current
4. **Monitor Issues**: Watch for user feedback and bug reports

Your package will be available at: `https://www.npmjs.com/package/contempo-gallery`