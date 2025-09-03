import React, { useState, useCallback } from 'react';
import { ContempoGalleryProps } from './types';
import { ContempoLightbox } from './ContempoLightbox';
import './ContempoGallery.css';

export const ContempoGallery: React.FC<ContempoGalleryProps> = ({
  images,
  columns = 3,
  gap = 8,
  className = '',
  onImageClick,
  showLightbox = true,
  lightboxClassName = ''
}) => {
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
    '--gallery-gap': `${gap}px`
  } as React.CSSProperties;

  return (
    <>
      <div 
        className={`contempo-gallery ${className}`}
        style={gridStyle}
        role="grid"
        aria-label="Image gallery"
      >
        {images.map((image, index) => (
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
            <img
              src={image.thumbnail || image.src}
              alt={image.alt || `Gallery image ${index + 1}`}
              className="contempo-gallery__image"
              loading="lazy"
            />
            {image.caption && (
              <div className="contempo-gallery__caption">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {showLightbox && (
        <ContempoLightbox
          images={images}
          currentIndex={currentIndex}
          isOpen={lightboxOpen}
          onClose={handleLightboxClose}
          onNext={handleNext}
          onPrev={handlePrev}
          className={lightboxClassName}
        />
      )}
    </>
  );
};