# Deploying Contempo Gallery Example to Vercel

This guide shows you how to deploy the example app to Vercel so you can share a live demo of the gallery component.

## Quick Deploy (Recommended)

### Option 1: Deploy from GitHub

1. **Push to GitHub**:
   ```bash
   cd contempo-gallery
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/contempo-gallery.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration and deploy

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd contempo-gallery
   vercel
   ```

3. **Follow the prompts**:
   - Choose your account
   - Confirm project settings
   - Deploy!

## Manual Configuration

If you need to configure manually, here are the settings:

### Project Settings
- **Framework Preset**: Vite
- **Build Command**: `cd example && npm install && npm run build`
- **Output Directory**: `example/dist`
- **Install Command**: `npm install`

### Environment Variables
None required for the basic example.

## File Structure

The deployment is configured with these files:

```
contempo-gallery/
├── vercel.json          # Vercel configuration
├── example/
│   ├── package.json     # Example app dependencies
│   ├── vite.config.ts   # Vite configuration
│   ├── index.html       # HTML entry point
│   ├── main.tsx         # React entry point
│   └── App.tsx          # Gallery examples
└── src/                 # Gallery component source
```

## How It Works

1. **Vercel reads** `vercel.json` configuration
2. **Installs dependencies** in the root directory
3. **Builds the example app** using Vite
4. **Serves** the static files from `example/dist`
5. **Handles routing** with SPA rewrites

## Customizing the Example

To customize what's shown in the deployed example:

### Add More Gallery Variants

Edit `example/App.tsx`:

```tsx
// Add more sections
<section style={{ marginBottom: '40px' }}>
  <h2>Custom Gallery</h2>
  <ContempoGallery 
    images={customImages}
    columns={5}
    gap={20}
  />
</section>
```

### Use Different Images

Replace the sample images in `example/App.tsx`:

```tsx
const customImages: ContempoGalleryImage[] = [
  {
    src: 'https://your-domain.com/image1.jpg',
    alt: 'Your custom image',
    caption: 'Custom caption'
  }
  // ... more images
];
```

### Add Custom Styling

Create `example/custom.css` and import it in `App.tsx`:

```tsx
import './custom.css';
```

## Environment Variables

If you need to add environment variables:

1. **In Vercel Dashboard**: Go to Project Settings > Environment Variables
2. **Local Development**: Create `example/.env.local`

## Troubleshooting

### Build Fails

**Check the build logs** in Vercel dashboard. Common issues:

1. **Dependency issues**: Make sure `package.json` is correct
2. **Import errors**: Verify all imports are working locally
3. **TypeScript errors**: Run `npm run typecheck` locally

### Images Not Loading

If using custom images:

1. **CORS issues**: Make sure image URLs allow cross-origin requests
2. **HTTPS required**: Vercel requires HTTPS URLs for images

### Routing Issues

The `vercel.json` includes SPA routing configuration. If you have custom routes, update:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Domain Configuration

### Custom Domain

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS as instructed

### Preview Deployments

- Every push creates a preview deployment
- Pull requests get automatic preview URLs
- Production deployment happens on main branch

## Performance Optimization

The example is already optimized with:

- **Image lazy loading** in the gallery component
- **Code splitting** via Vite
- **Static asset optimization**
- **CDN delivery** via Vercel

## Analytics

To add analytics:

1. **Enable Vercel Analytics** in project settings
2. **Add custom tracking** in `App.tsx`:

```tsx
// Add to App.tsx
useEffect(() => {
  // Your analytics code
}, []);
```

## Live Example

Once deployed, you'll get a URL like:
`https://contempo-gallery-xyz.vercel.app`

Share this URL to showcase your gallery component!

## Updating the Deployment

To update the live example:

```bash
git add .
git commit -m "Update example"
git push
```

Vercel automatically redeploys on every push to main branch.

## Alternative Platforms

The same configuration works on:

- **Netlify**: Use `netlify.toml` instead of `vercel.json`
- **GitHub Pages**: Configure GitHub Actions for build
- **Firebase Hosting**: Use Firebase CLI

The Vite build output is platform-agnostic and works anywhere static sites are supported.