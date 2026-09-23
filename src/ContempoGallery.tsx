import React, { useState, useCallback } from 'react';
import { ContempoGalleryImage, ContempoGalleryProps } from './types';
import { ContempoLightbox } from './ContempoLightbox';
import './ContempoGallery.css';

export function ContempoGallery<T extends ContempoGalleryImage>({
  images,
  columns = 3,
  gap = 8,
  aspectRatio,
  className = '',
  onImageClick,
  showLightbox = true,
  lightboxClassName = '',
  renderImage,
  renderLightboxFooter
}: ContempoGalleryProps<T>) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = useCallback((index: number) => {
    if (onImageClick) {
      onImageClick(index, images[index]);
    }
    
    if (showLightbox) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
  }, [images, onImageClick, showLightbox]);

  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const gridStyle = {
    '--gallery-columns': columns,
    '--gallery-gap': `${gap}px`,
    ...(aspectRatio && { '--gallery-aspect-ratio': aspectRatio })
  } as React.CSSProperties;

  return (
    <>
      <div 
        className={`contempo-gallery ${className}`.trim()}
        style={gridStyle}
        role="grid"
        aria-label="Image gallery"
      >
        {images.map((image, index) => {
          const alt = image.alt || `Gallery image ${index + 1}`;
          return (
          <div
            key={index}
            className="contempo-gallery__item"
            role="gridcell"
            onClick={() => handleImageClick(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleImageClick(index);
              }
            }}
            tabIndex={0}
            aria-label={`Image ${index + 1} of ${images.length}${image.alt ? `: ${image.alt}` : ''}`}
          >
            {renderImage ? (
              renderImage(image, { index, variant: 'grid', className: 'contempo-gallery__image', alt })
            ) : (
              <img
                src={image.thumbnail || image.src}
                alt={alt}
                className="contempo-gallery__image"
                loading="lazy"
              />
            )}
            {image.caption && (
              <div className="contempo-gallery__caption">
                {image.caption}
              </div>
            )}
          </div>
          );
        })}
      </div>

      {showLightbox && (
        <ContempoLightbox
          images={images}
          currentIndex={Math.min(currentIndex, images.length - 1)}
          isOpen={lightboxOpen}
          onClose={handleLightboxClose}
          onNext={handleNext}
          onPrev={handlePrev}
          className={lightboxClassName}
          renderImage={renderImage}
          renderLightboxFooter={renderLightboxFooter}
        />
      )}
    </>
  );
}
