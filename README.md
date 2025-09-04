# Contempo Gallery

A dynamic responsive React image gallery component with lightbox functionality, built with TypeScript and designed for accessibility.

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
npm install contempo-gallery
```

## Basic Usage

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
import { ContempoGallery, ContempoGalleryImage } from 'contempo-gallery';

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
- IE 11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome Mobile)

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
import { ContempoGallery, ContempoGalleryProps, ContempoGalleryImage } from 'contempo-gallery';
```

## License

MIT © Contempo Web Design

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.