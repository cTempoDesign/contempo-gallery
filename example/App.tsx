import React from 'react';
import { ContempoGallery, ContempoGalleryImage } from 'contempo-gallery';

// Sample images for demonstration
const sampleImages: ContempoGalleryImage[] = [
  {
    src: 'https://picsum.photos/800/600?random=1',
    alt: 'Random image 1',
    caption: 'Beautiful landscape with mountains'
  },
  {
    src: 'https://picsum.photos/800/600?random=2',
    alt: 'Random image 2',
    caption: 'Urban architecture and city life'
  },
  {
    src: 'https://picsum.photos/800/600?random=3',
    alt: 'Random image 3',
    caption: 'Nature and wildlife photography'
  },
  {
    src: 'https://picsum.photos/800/600?random=4',
    alt: 'Random image 4'
  },
  {
    src: 'https://picsum.photos/800/600?random=5',
    alt: 'Random image 5',
    caption: 'Abstract art and design'
  },
  {
    src: 'https://picsum.photos/800/600?random=6',
    alt: 'Random image 6'
  },
  {
    src: 'https://picsum.photos/800/600?random=7',
    alt: 'Random image 7',
    caption: 'Travel and adventure'
  },
  {
    src: 'https://picsum.photos/800/600?random=8',
    alt: 'Random image 8'
  },
  {
    src: 'https://picsum.photos/800/600?random=9',
    alt: 'Random image 9',
    caption: 'Food and culinary arts'
  }
];

export default function App() {
  const handleImageClick = (index: number, image: ContempoGalleryImage) => {
    console.log(`Clicked image ${index}:`, image);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Contempo Gallery Example</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Basic Gallery (3 columns)</h2>
        <ContempoGallery 
          images={sampleImages}
          columns={3}
          gap={16}
          onImageClick={handleImageClick}
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>4 Column Gallery</h2>
        <ContempoGallery 
          images={sampleImages.slice(0, 8)}
          columns={4}
          gap={12}
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>2 Column Gallery with Larger Gap</h2>
        <ContempoGallery 
          images={sampleImages.slice(0, 6)}
          columns={2}
          gap={24}
        />
      </section>

      <section>
        <h2>Gallery without Lightbox</h2>
        <ContempoGallery 
          images={sampleImages.slice(0, 4)}
          columns={2}
          gap={16}
          showLightbox={false}
          onImageClick={(index, image) => {
            alert(`Custom click handler: ${image.alt}`);
          }}
        />
      </section>
    </div>
  );
}