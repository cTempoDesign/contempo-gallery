import React, { useState } from 'react';
import { ContempoGallery, ContempoGalleryImage, RenderImageProps } from 'contempo-gallery';

// Sample images for basic demonstration
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
  }
];

// Sample images with Next.js Image optimization properties
const nextJsOptimizedImages: ContempoGalleryImage[] = [
  {
    src: 'https://picsum.photos/800/600?random=10',
    alt: 'Optimized image 1',
    caption: 'High priority image with blur placeholder',
    width: 800,
    height: 600,
    priority: true,
    quality: 95,
    placeholder: 'blur',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
  },
  {
    src: 'https://picsum.photos/800/600?random=11',
    alt: 'Optimized image 2',
    caption: 'Standard quality optimization',
    width: 800,
    height: 600,
    quality: 85,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  },
  {
    src: 'https://picsum.photos/800/600?random=12',
    alt: 'Optimized image 3',
    caption: 'Responsive with custom sizes',
    width: 800,
    height: 600,
    quality: 90,
    sizes: '(max-width: 768px) 100vw, 50vw'
  },
  {
    src: 'https://picsum.photos/800/600?random=13',
    alt: 'Optimized image 4',
    width: 800,
    height: 600,
    quality: 80
  }
];

// Mock Next.js Image component for demonstration
const MockNextImage: React.FC<any> = ({ src, alt, width, height, className, ...props }) => {
  return (
    <div
      className={`mock-next-image ${className || ''}`}
      style={{
        position: 'relative',
        border: '2px dashed #0070f3',
        borderRadius: '4px'
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          background: '#0070f3',
          color: 'white',
          padding: '2px 6px',
          fontSize: '10px',
          borderRadius: '2px',
          fontWeight: 'bold'
        }}
      >
        Next.js Image
      </div>
    </div>
  );
};

export default function App() {
  const [selectedDemo, setSelectedDemo] = useState<string>('basic');

  const handleImageClick = (index: number, image: ContempoGalleryImage) => {
    console.log(`Clicked image ${index}:`, image);
  };

  // Custom render function for demonstration
  const customRenderImage = (props: RenderImageProps) => {
    const { image, index, isLightbox, className, onClick, onKeyDown, ...rest } = props;

    if (isLightbox) {
      // Custom lightbox rendering
      return (
        <div className="custom-lightbox-image" style={{ textAlign: 'center' }}>
          <img
            src={image.src}
            alt={image.alt}
            className={className}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              filter: 'brightness(1.05) contrast(1.05)'
            }}
          />
          {image.caption && (
            <p style={{
              marginTop: '16px',
              color: 'white',
              fontSize: '18px',
              fontWeight: '500'
            }}>
              {image.caption}
            </p>
          )}
        </div>
      );
    }

    // Custom gallery rendering
    return (
      <div
        className="custom-image-wrapper"
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...rest}
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          padding: '4px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <img
          src={image.thumbnail || image.src}
          alt={image.alt}
          className={className}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            display: 'block'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          #{index + 1}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
            padding: '20px 12px 12px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Click to view • Custom Styled
        </div>
      </div>
    );
  };

  const demoSections = [
    { id: 'basic', title: 'Basic Usage (Non-Next.js)' },
    { id: 'nextjs', title: 'Next.js Image Integration' },
    { id: 'custom', title: 'Custom Render Props' },
    { id: 'comparison', title: 'Side-by-Side Comparison' }
  ];

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const navStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    borderBottom: '2px solid #eee',
    paddingBottom: '16px'
  };

  const buttonStyle = (active: boolean) => ({
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: active ? '#0070f3' : '#f5f5f5',
    color: active ? 'white' : '#333',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  });

  const sectionStyle = {
    marginBottom: '48px'
  };

  const codeBlockStyle = {
    background: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '16px',
    fontFamily: 'Monaco, Consolas, monospace',
    fontSize: '13px',
    overflow: 'auto',
    marginBottom: '24px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '8px', color: '#333' }}>
        🖼️ Contempo Gallery Demo
      </h1>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '16px' }}>
        Framework-agnostic React image gallery with optional Next.js Image optimization
      </p>

      {/* Navigation */}
      <nav style={navStyle}>
        {demoSections.map((section) => (
          <button
            key={section.id}
            style={buttonStyle(selectedDemo === section.id)}
            onClick={() => setSelectedDemo(section.id)}
            onMouseEnter={(e) => {
              if (selectedDemo !== section.id) {
                e.currentTarget.style.background = '#e9ecef';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDemo !== section.id) {
                e.currentTarget.style.background = '#f5f5f5';
              }
            }}
          >
            {section.title}
          </button>
        ))}
      </nav>

      {/* Basic Usage Demo */}
      {selectedDemo === 'basic' && (
        <div>
          <h2 style={{ color: '#333', marginBottom: '16px' }}>
            Basic Usage (Non-Next.js Applications)
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Perfect for Create React App, Vite, or any React application. Uses native &lt;img&gt; elements with lazy loading.
          </p>

          <div style={codeBlockStyle}>
            {`import { ContempoGallery } from 'contempo-gallery';

<ContempoGallery
  images={images}
  columns={3}
  gap={16}
  onImageClick={(index, image) => console.log('Clicked:', image)}
/>`}
          </div>

          <div style={sectionStyle}>
            <h3>Standard Gallery (3 columns)</h3>
            <ContempoGallery
              images={sampleImages}
              columns={3}
              gap={16}
              onImageClick={handleImageClick}
            />
          </div>

          <div style={sectionStyle}>
            <h3>Without Lightbox</h3>
            <ContempoGallery
              images={sampleImages.slice(0, 4)}
              columns={2}
              gap={16}
              showLightbox={false}
              onImageClick={(index: number, image: ContempoGalleryImage) => {
                alert(`Custom click handler: ${image.alt}`);
              }}
            />
          </div>
        </div>
      )}

      {/* Next.js Image Demo */}
      {selectedDemo === 'nextjs' && (
        <div>
          <h2 style={{ color: '#333', marginBottom: '16px' }}>
            Next.js Image Integration
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Enable Next.js Image optimization for automatic format conversion, lazy loading, and performance improvements.
            Images with blue dashed borders simulate Next.js Image optimization.
          </p>

          <div style={codeBlockStyle}>
            {`import Image from 'next/image';
import { ContempoGallery } from 'contempo-gallery';

const optimizedImages = [
  {
    src: '/image.jpg',
    alt: 'Optimized image',
    width: 800,
    height: 600,
    priority: true,
    quality: 95,
    placeholder: 'blur',
    blurDataURL: 'data:image/jpeg;base64,...'
  }
];

<ContempoGallery
  images={optimizedImages}
  NextImage={Image}
  useNextImage={true}
  nextImageProps={{
    sizes: '(max-width: 768px) 100vw, 50vw'
  }}
/>`}
          </div>

          <div style={sectionStyle}>
            <h3>Next.js Optimized Images</h3>
            <ContempoGallery
              images={nextJsOptimizedImages}
              columns={2}
              gap={20}
              NextImage={MockNextImage}
              useNextImage={true}
              onImageClick={handleImageClick}
              nextImageProps={{
                sizes: '(max-width: 768px) 100vw, 50vw'
              }}
            />
          </div>

          <div style={{
            background: '#e7f3ff',
            border: '1px solid #b3d7ff',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '24px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0066cc' }}>
              💡 Next.js Configuration Required
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#0066cc' }}>
              For remote images, add domains to your <code>next.config.js</code>:
              <br />
              <code>images: {`{ remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }] }`}</code>
            </p>
          </div>
        </div>
      )}

      {/* Custom Render Props Demo */}
      {selectedDemo === 'custom' && (
        <div>
          <h2 style={{ color: '#333', marginBottom: '16px' }}>
            Custom Render Props
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Complete control over image rendering using the <code>renderImage</code> prop.
            Perfect for custom styling, overlays, or integration with other image libraries.
          </p>

          <div style={codeBlockStyle}>
            {`const customRenderImage = (props) => {
  const { image, index, isLightbox, className, onClick } = props;

  if (isLightbox) {
    return (
      <div className="custom-lightbox">
        <img src={image.src} alt={image.alt} className={className} />
        <p>{image.caption}</p>
      </div>
    );
  }

  return (
    <div className="custom-gallery-item" onClick={onClick}>
      <img src={image.src} alt={image.alt} />
      <div className="overlay">#{index + 1}</div>
    </div>
  );
};

<ContempoGallery
  images={images}
  renderImage={customRenderImage}
/>`}
          </div>

          <div style={sectionStyle}>
            <h3>Custom Styled Gallery</h3>
            <ContempoGallery
              images={sampleImages}
              columns={3}
              gap={16}
              renderImage={customRenderImage}
              onImageClick={handleImageClick}
            />
          </div>

          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '24px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>
              🎨 Render Props Priority
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
              Custom <code>renderImage</code> takes precedence over both Next.js Image and native img elements.
              Use this for complete control over rendering behavior.
            </p>
          </div>
        </div>
      )}

      {/* Comparison Demo */}
      {selectedDemo === 'comparison' && (
        <div>
          <h2 style={{ color: '#333', marginBottom: '16px' }}>
            Side-by-Side Comparison
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Compare different image rendering approaches side by side.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div>
              <h3 style={{
                marginBottom: '12px',
                padding: '8px 12px',
                background: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '16px'
              }}>
                Standard Images
              </h3>
              <ContempoGallery
                images={sampleImages.slice(0, 4)}
                columns={2}
                gap={12}
              />
            </div>

            <div>
              <h3 style={{
                marginBottom: '12px',
                padding: '8px 12px',
                background: '#e7f3ff',
                borderRadius: '4px',
                fontSize: '16px'
              }}>
                Next.js Optimized
              </h3>
              <ContempoGallery
                images={nextJsOptimizedImages.slice(0, 4)}
                columns={2}
                gap={12}
                NextImage={MockNextImage}
                useNextImage={true}
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={{
              marginBottom: '12px',
              padding: '8px 12px',
              background: '#fff3cd',
              borderRadius: '4px',
              fontSize: '16px'
            }}>
              Custom Render Props
            </h3>
            <ContempoGallery
              images={sampleImages.slice(0, 6)}
              columns={3}
              gap={16}
              renderImage={customRenderImage}
            />
          </div>

          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#155724' }}>
              ✅ Framework Agnostic Design
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#155724' }}>
              <li>Works in any React application (CRA, Vite, Next.js)</li>
              <li>No runtime dependencies on Next.js</li>
              <li>Graceful fallbacks when optimization isn't available</li>
              <li>TypeScript support with full type safety</li>
            </ul>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '64px',
        paddingTop: '32px',
        borderTop: '1px solid #eee',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>
          Open your browser's developer console to see image click events logged.
          <br />
          Built with ❤️ using Contempo Gallery
        </p>
      </footer>
    </div>
  );
}