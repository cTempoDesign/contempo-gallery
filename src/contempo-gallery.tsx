import React, { useState, useCallback } from 'react';
import { ContempoGalleryProps, RenderImageProps } from './types';
import { ContempoLightbox } from './contempo-lightbox';
import './contempo-gallery.css';

export const ContempoGallery: React.FC<ContempoGalleryProps> = ({
  images,
  columns = 3,
  gap = 8,
  className = '',
  onImageClick,
  showLightbox = true,
  lightboxClassName = '',
  NextImage,
  useNextImage = false,
  renderImage,
  nextImageProps = {}
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

  const renderImageElement = useCallback((
    image: typeof images[0],
    index: number,
    isLightbox: boolean = false
  ) => {
    const imageProps: RenderImageProps = {
      image,
      index,
      isLightbox,
      className: "contempo-gallery__image",
      onClick: isLightbox ? undefined : () => handleImageClick(index),
      onKeyDown: isLightbox ? undefined : (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleImageClick(index);
        }
      },
      tabIndex: isLightbox ? undefined : 0,
      'aria-label': isLightbox ? undefined : `Image ${index + 1} of ${images.length}${image.alt ? `: ${image.alt}` : ''}`,
      loading: isLightbox ? 'eager' : 'lazy'
    };

    // Custom render prop takes precedence
    if (renderImage) {
      return renderImage(imageProps);
    }

    // Use Next.js Image if provided and enabled
    if (useNextImage && NextImage) {
      const nextProps = {
        src: isLightbox ? image.src : (image.thumbnail || image.src),
        alt: image.alt || `Gallery image ${index + 1}`,
        className: "contempo-gallery__image",
        loading: isLightbox ? 'eager' : 'lazy',
        ...nextImageProps,
        // Include Next.js specific props from image if they exist
        ...(image.width && { width: image.width }),
        ...(image.height && { height: image.height }),
        ...(image.fill && { fill: image.fill }),
        ...(image.sizes && { sizes: image.sizes }),
        ...(image.priority && { priority: image.priority }),
        ...(image.quality && { quality: image.quality }),
        ...(image.placeholder && { placeholder: image.placeholder }),
        ...(image.blurDataURL && { blurDataURL: image.blurDataURL })
      };

      return React.createElement(NextImage, nextProps);
    }

    // Fallback to native img
    return (
      <img
        src={isLightbox ? image.src : (image.thumbnail || image.src)}
        alt={image.alt || `Gallery image ${index + 1}`}
        className="contempo-gallery__image"
        loading={isLightbox ? 'eager' : 'lazy'}
      />
    );
  }, [NextImage, useNextImage, renderImage, nextImageProps, handleImageClick, images.length]);

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
            {renderImageElement(image, index, false)}
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
          NextImage={NextImage}
          useNextImage={useNextImage}
          renderImage={renderImage}
          nextImageProps={nextImageProps}
        />
      )}
    </>
  );
};