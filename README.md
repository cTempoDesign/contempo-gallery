# Contempo Gallery

A framework-agnostic React image gallery component with lightbox functionality, built with TypeScript and designed for accessibility. Optionally supports Next.js Image optimization for enhanced performance.

## 🌟 [Live Demo](https://contempo-gallery-showcase.vercel.app/)

See the gallery in action with multiple configurations and examples.

## Features

- 🖼️ **Responsive Grid Layout**: Automatically adjusts columns based on screen size
- 🔍 **Lightbox Modal**: Click any image to view in full-screen lightbox
- ⌨️ **Keyboard Navigation**: Full keyboard support with arrow keys and escape
- ♿ **Accessible**: Built with screen readers and accessibility in mind
- 📱 **Mobile Friendly**: Optimized for touch devices
- 🎨 **Customizable**: Easy to theme and customize
- ⚡ **Performance**: Lazy loading and optimized rendering
- 🖼️ **Next.js Image Support**: Optional Next.js Image optimization
- 🔧 **Custom Render Props**: Full control over image rendering

## Installation

```bash
npm install contempo-gallery
```

## Basic Usage (Non-Next.js Applications)

Perfect for Create React App, Vite, or any React application:

```tsx
import React from 'react';
import { ContempoGallery } from 'contempo-gallery';
// CSS styles are automatically imported, no need to import manually

const images = [
  {
    src: 'https://example.com/image1.jpg',
    alt: 'Beautiful landscape',
    caption: 'A stunning mountain view'
  },
  {
    src: 'https://example.com/image2.jpg',
    alt: 'City skyline',
    caption: 'Modern city architecture',
    thumbnail: 'https://example.com/thumb2.jpg' // Optional thumbnail
  },
  {
    src: 'https://example.com/image3.jpg',
    alt: 'Ocean waves'
  }
];

function App() {
  return (
    <div className="App">
      <h1>My Photo Gallery</h1>
      <ContempoGallery
        images={images}
        columns={3}
        gap={16}
      />
    </div>
  );
}

export default App;
```

## Next.js Usage (With Image Optimization)

For Next.js applications, you can enable Next.js Image optimization for better performance:

```tsx
import React from 'react';
import Image from 'next/image';
import { ContempoGallery } from 'contempo-gallery';

const images = [
  {
    src: 'https://example.com/image1.jpg',
    alt: 'Beautiful landscape',
    caption: 'A stunning mountain view',
    width: 800,
    height: 600,
    priority: true // First image can be prioritized
  },
  {
    src: 'https://example.com/image2.jpg',
    alt: 'City skyline',
    caption: 'Modern city architecture',
    thumbnail: 'https://example.com/thumb2.jpg',
    width: 800,
    height: 600,
    quality: 90
  },
  {
    src: 'https://example.com/image3.jpg',
    alt: 'Ocean waves',
    width: 800,
    height: 600,
    fill: false,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
];

function GalleryPage() {
  return (
    <div>
      <h1>My Next.js Photo Gallery</h1>
      <ContempoGallery
        images={images}
        NextImage={Image}
        useNextImage={true}
        columns={3}
        gap={16}
        // Pass additional props to all Next.js Image components
        nextImageProps={{
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
          placeholder: 'blur'
        }}
      />
    </div>
  );
}

export default GalleryPage;
```

### Next.js Configuration for Remote Images

When using Next.js Image with remote URLs, you need to configure `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // For Next.js 13+, use remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'your-cdn.com',
        port: '',
        pathname: '**',
      }
    ],
    // For older Next.js versions, use domains
    // domains: ['example.com', 'your-cdn.com'],
  },
}

module.exports = nextConfig;
```

## Custom Image Rendering

For complete control over image rendering, use the `renderImage` prop:

```tsx
import React from 'react';
import { ContempoGallery, RenderImageProps } from 'contempo-gallery';

const customRenderImage = (props: RenderImageProps) => {
  const { image, index, isLightbox, className, onClick, onKeyDown, ...rest } = props;

  if (isLightbox) {
    // Custom lightbox image rendering
    return (
      <div className="custom-lightbox-container">
        <img
          src={image.src}
          alt={image.alt}
          className={className}
          style={{ filter: 'brightness(1.1)' }}
        />
        {image.caption && (
          <p className="custom-caption">{image.caption}</p>
        )}
      </div>
    );
  }

  // Custom gallery image rendering
  return (
    <div
      className="custom-image-wrapper"
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <img
        src={image.thumbnail || image.src}
        alt={image.alt}
        className={className}
        style={{ borderRadius: '8px' }}
      />
      <div className="image-overlay">
        <span>View #{index + 1}</span>
      </div>
    </div>
  );
};

function CustomGallery() {
  return (
    <ContempoGallery
      images={images}
      renderImage={customRenderImage}
    />
  );
}
```

## API Reference

### ContempoGalleryProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `ContempoGalleryImage[]` | **required** | Array of image objects |
| `columns` | `number` | `3` | Number of columns in desktop view |
| `gap` | `number` | `8` | Gap between images in pixels |
| `className` | `string` | `''` | Additional CSS class for gallery container |
| `onImageClick` | `(index, image) => void` | `undefined` | Callback when image is clicked |
| `showLightbox` | `boolean` | `true` | Whether to show lightbox on image click |
| `lightboxClassName` | `string` | `''` | Additional CSS class for lightbox |
| `NextImage` | `React.ComponentType` | `undefined` | Next.js Image component |
| `useNextImage` | `boolean` | `false` | Whether to use Next.js Image optimization |
| `renderImage` | `RenderImageFunction` | `undefined` | Custom image render function |
| `nextImageProps` | `object` | `{}` | Additional props passed to Next.js Image |

### ContempoGalleryImage

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `src` | `string` | ✅ | Main image URL |
| `alt` | `string` | ❌ | Alt text for accessibility |
| `caption` | `string` | ❌ | Caption displayed below image |
| `thumbnail` | `string` | ❌ | Thumbnail URL (fallback to `src`) |
| `width` | `number` | ❌ | Image width (Next.js Image) |
| `height` | `number` | ❌ | Image height (Next.js Image) |
| `fill` | `boolean` | ❌ | Use fill mode (Next.js Image) |
| `sizes` | `string` | ❌ | Responsive sizes (Next.js Image) |
| `priority` | `boolean` | ❌ | High priority loading (Next.js Image) |
| `quality` | `number` | ❌ | Image quality 1-100 (Next.js Image) |
| `placeholder` | `'blur' \| 'empty'` | ❌ | Placeholder type (Next.js Image) |
| `blurDataURL` | `string` | ❌ | Blur placeholder data URL (Next.js Image) |

## SSR and Hydration Considerations

When using Next.js Image optimization:

### 1. Provide Width and Height

Always provide `width` and `height` to prevent layout shift:

```tsx
const images = [
  {
    src: '/image.jpg',
    alt: 'Example',
    width: 800,
    height: 600, // Prevents CLS (Cumulative Layout Shift)
  }
];
```

### 2. Use Fill with Container

For responsive images, use `fill` with a positioned container:

```tsx
const images = [
  {
    src: '/image.jpg',
    alt: 'Example',
    fill: true,
    sizes: '(max-width: 768px) 100vw, 50vw'
  }
];

// Add CSS for containers
// .contempo-gallery__image { position: relative; }
```

### 3. Priority Loading

Mark above-the-fold images as priority:

```tsx
const images = [
  {
    src: '/hero-image.jpg',
    alt: 'Hero image',
    priority: true, // Loads immediately
    width: 800,
    height: 600
  }
];
```

## Styling

The component comes with default styles, but you can customize them:

### CSS Custom Properties

```css
.contempo-gallery {
  --gallery-columns: 3;
  --gallery-gap: 8px;
}

/* Custom responsive breakpoints */
@media (max-width: 768px) {
  .contempo-gallery {
    --gallery-columns: 2;
  }
}

@media (max-width: 480px) {
  .contempo-gallery {
    --gallery-columns: 1;
  }
}
```

### Custom Styling

```css
/* Gallery container */
.contempo-gallery {
  border-radius: 12px;
  padding: 16px;
}

/* Individual image items */
.contempo-gallery__item {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.contempo-gallery__item:hover {
  transform: scale(1.02);
}

/* Image styling */
.contempo-gallery__image {
  border-radius: 4px;
}

/* Caption styling */
.contempo-gallery__caption {
  font-size: 0.875rem;
  color: #666;
  margin-top: 8px;
}

/* Lightbox customization */
.contempo-lightbox {
  backdrop-filter: blur(8px);
}

.contempo-lightbox__image {
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
```

## TypeScript Support

The package is built with TypeScript and includes full type definitions:

```tsx
import {
  ContempoGallery,
  ContempoGalleryProps,
  ContempoGalleryImage,
  RenderImageProps,
  RenderImageFunction
} from 'contempo-gallery';

// Fully typed image array
const images: ContempoGalleryImage[] = [
  {
    src: '/image.jpg',
    alt: 'Typed image',
    width: 800,
    height: 600
  }
];

// Typed render function
const renderImage: RenderImageFunction = (props: RenderImageProps) => {
  // props are fully typed
  return <img src={props.image.src} alt={props.image.alt} />;
};
```

## Performance Tips

1. **Use thumbnails** for gallery view and full-size for lightbox
2. **Enable Next.js Image optimization** for automatic format conversion and optimization
3. **Set appropriate `sizes`** for responsive images
4. **Use `priority`** for above-the-fold images
5. **Lazy loading** is enabled by default for gallery images

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Contempo Web Design](https://github.com/cTempoDesign)