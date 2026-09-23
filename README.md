# Contempo Gallery

A dynamic responsive React image gallery component with lightbox functionality, built with TypeScript and designed for accessibility.

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

## Installation

```bash
npm install @contempo/react-photo-gallery
```

Published on the public npm registry: no token or `.npmrc` needed.

## Next.js

Works with the App Router out of the box. The build ships with a `'use client'` directive, so you can render the gallery straight from a server component; styles are injected automatically, no CSS import needed.

```tsx
// app/gallery/page.tsx
import { ContempoGallery } from '@contempo/react-photo-gallery';

export default function Page() {
  return <ContempoGallery images={[{ src: '/photos/one.jpg', alt: 'One' }]} />;
}
```

## Basic Usage

```tsx
import React from 'react';
import { ContempoGallery } from '@contempo/react-photo-gallery';
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
    caption: 'Modern city architecture'
  },
  {
    src: 'https://example.com/image3.jpg',
    alt: 'Ocean waves'
  }
];

function App() {
  return (
    <div>
      <h1>My Photo Gallery</h1>
      <ContempoGallery images={images} columns={3} gap={12} />
    </div>
  );
}
```

## Props

### Gallery Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `ContempoGalleryImage[]` | required | Array of images to display |
| `columns` | `number` | `3` | Number of columns in the grid |
| `gap` | `number` | `8` | Gap between images in pixels |
| `className` | `string` | `''` | Additional CSS class for the gallery |
| `onImageClick` | `(index: number, image: ContempoGalleryImage) => void` | - | Callback when an image is clicked |
| `showLightbox` | `boolean` | `true` | Whether to show the lightbox on image click |
| `lightboxClassName` | `string` | `''` | Additional CSS class for the lightbox |
| `aspectRatio` | `string` | `'1'` | CSS aspect ratio for grid tiles, e.g. `'3 / 2'` |
| `renderImage` | `(image, { index, variant, className, alt }) => ReactNode` | - | Replace the default `<img>` in the grid (`variant: 'grid'`) and lightbox (`variant: 'lightbox'`), e.g. with `next/image` |
| `renderLightboxFooter` | `(image, index) => ReactNode` | - | Extra content under the active lightbox image, e.g. a buy button |

Images can carry extra fields (e.g. `photoId`); the component is generic, so `renderImage`, `renderLightboxFooter` and `onImageClick` receive your full image type.

The lightbox supports arrow keys, Escape, and swipe left/right on touch screens. Images slide in from the direction you navigate, follow your finger while swiping, and the neighbouring images are preloaded so the next one is ready before you get there (skipped when you pass `renderImage`, which may load its own URLs).

### ContempoGalleryImage Interface

```tsx
interface ContempoGalleryImage {
  src: string;           // Main image URL
  alt?: string;          // Alt text for accessibility
  caption?: string;      // Optional caption text
  thumbnail?: string;    // Optional thumbnail URL (uses src if not provided)
}
```

## Advanced Usage

### Custom Click Handler

```tsx
import { ContempoGallery, ContempoGalleryImage } from '@contempo/react-photo-gallery';

function CustomGallery() {
  const handleImageClick = (index: number, image: ContempoGalleryImage) => {
    console.log(`Clicked image ${index}:`, image);
    // Custom logic here
  };

  return (
    <ContempoGallery 
      images={images}
      onImageClick={handleImageClick}
      showLightbox={false} // Disable built-in lightbox
    />
  );
}
```

### With next/image (Next.js)

Render props are functions, so they must be passed from a client component. Keep data loading in the server component and wrap the gallery in a small client component:

```tsx
'use client';
import Image from 'next/image';
import { ContempoGallery } from '@contempo/react-photo-gallery';

type Photo = { src: string; alt: string; blurDataURL: string; photoId: string };

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  return (
    <ContempoGallery
      images={photos}
      columns={4}
      gap={24}
      aspectRatio="3 / 2"
      renderImage={(photo, { variant, className, alt, index }) =>
        variant === 'grid' ? (
          <Image src={photo.src} alt={alt} className={className} fill
            sizes="(max-width: 768px) 100vw, 25vw" priority={index < 4}
            placeholder="blur" blurDataURL={photo.blurDataURL} />
        ) : (
          <div style={{ position: 'relative', width: '90vw', height: '75vh' }}>
            <Image src={photo.src} alt={alt} fill sizes="90vw" style={{ objectFit: 'contain' }} />
          </div>
        )
      }
      renderLightboxFooter={(photo) => <a href={`/shop/${photo.photoId}`}>Buy print</a>}
    />
  );
}
```

### Responsive Columns

```tsx
// The gallery automatically adapts:
// - Desktop: Uses your specified column count
// - Tablet (≤768px): Max 2 columns
// - Mobile (≤480px): Single column

<ContempoGallery 
  images={images}
  columns={4} // Will show 4 on desktop, 2 on tablet, 1 on mobile
/>
```

### With Thumbnails

```tsx
const images = [
  {
    src: 'https://example.com/full-image1.jpg',
    thumbnail: 'https://example.com/thumb-image1.jpg',
    alt: 'Description',
    caption: 'Image caption'
  }
  // ...
];
```

## Keyboard Controls

When the lightbox is open:
- `←` / `→` Arrow keys: Navigate between images  
- `Escape`: Close the lightbox
- `Tab`: Navigate through interactive elements

## Styling

The gallery comes with built-in responsive styles, but you can customize it:

```css
/* Override default styles */
.contempo-gallery {
  border-radius: 12px;
  overflow: hidden;
}

.contempo-gallery__item {
  border-radius: 8px;
}

.contempo-lightbox {
  background: rgba(0, 0, 0, 0.95);
}
```

## Accessibility Features

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Focus management
- High contrast mode support
- Reduced motion support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

This package includes comprehensive unit tests with high coverage requirements.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite maintains high coverage standards:
- **Branches**: 90%
- **Functions**: 85%
- **Lines**: 90%
- **Statements**: 90%

Coverage reports are generated in the `coverage/` directory and include:
- Terminal summary
- HTML report (`coverage/lcov-report/index.html`)
- LCOV format for CI integration

### Test Structure

Tests are organized in `src/__tests__/`:
- `ContempoGallery.test.tsx` - Gallery component tests
- `ContempoLightbox.test.tsx` - Lightbox component tests  
- `types.test.ts` - Type definition tests

### What's Tested

**ContempoGallery Component:**
- Rendering with various props
- Image display and thumbnails
- Responsive grid behavior
- Lightbox integration
- Keyboard navigation
- Accessibility features
- Click handlers and callbacks

**ContempoLightbox Component:**
- Modal display and hiding
- Image navigation (next/prev)
- Keyboard shortcuts (ESC, arrows)
- Focus management
- Body scroll locking
- Touch/click handling
- Screen reader support

**Types:**
- Interface completeness
- Optional properties
- Callback signatures

### Continuous Integration

Tests run automatically on:
- Pull requests
- Builds
- Deployments (Vercel)

## Development & Examples

### Running the Local Showcase

To see the gallery in action and test different configurations:

```bash
# Clone or navigate to the project
cd contempo-gallery/example

# Install dependencies
npm install

# Start the development server
npm run dev
```

The showcase will be available at `http://localhost:5173/` and includes:

- **Basic 3-column gallery** with sample images
- **4-column gallery** variant  
- **2-column gallery** with larger gaps
- **Gallery without lightbox** (custom click handler demo)
- **Responsive behavior** testing

### Development Features

- **Hot reload** - Changes to components auto-refresh
- **TypeScript support** - Full type checking
- **Responsive testing** - Resize browser to test breakpoints
- **Accessibility testing** - Use keyboard navigation and screen readers

### Building the Package

```bash
# Build for distribution
npm run build

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## TypeScript

Fully typed with TypeScript. All props and interfaces are exported:

```tsx
import { ContempoGallery, ContempoGalleryProps, ContempoGalleryImage } from '@contempo/react-photo-gallery';
```

## License

MIT © Contempo Web Design

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.