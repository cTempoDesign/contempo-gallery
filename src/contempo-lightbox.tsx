import React, { useEffect, useCallback, useRef } from 'react';
import { ContempoLightboxProps, RenderImageProps } from './types';
import './contempo-lightbox.css';

export const ContempoLightbox: React.FC<ContempoLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  className = '',
  NextImage,
  useNextImage = false,
  renderImage,
  nextImageProps = {}
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onNext();
        break;
    }
  }, [isOpen, onClose, onNext, onPrev]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const renderImageElement = useCallback((
    image: typeof images[0],
    index: number
  ) => {
    const imageProps: RenderImageProps = {
      image,
      index,
      isLightbox: true,
      className: "contempo-lightbox__image",
      loading: 'eager'
    };

    // Custom render prop takes precedence
    if (renderImage) {
      return renderImage(imageProps);
    }

    // Use Next.js Image if provided and enabled
    if (useNextImage && NextImage) {
      const nextProps = {
        src: image.src,
        alt: image.alt || `Gallery image ${index + 1}`,
        className: "contempo-lightbox__image",
        loading: 'eager',
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
        src={image.src}
        alt={image.alt || `Gallery image ${index + 1}`}
        className="contempo-lightbox__image"
      />
    );
  }, [NextImage, useNextImage, renderImage, nextImageProps]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus the modal for screen readers
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      ref={modalRef}
      className={`contempo-lightbox ${className}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      tabIndex={-1}
    >
      <div className="contempo-lightbox__content">
        <button
          className="contempo-lightbox__close"
          onClick={onClose}
          aria-label="Close lightbox"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        {images.length > 1 && (
          <button
            className="contempo-lightbox__nav contempo-lightbox__nav--prev"
            onClick={onPrev}
            aria-label="Previous image"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        )}

        <div className="contempo-lightbox__image-container">
          {renderImageElement(currentImage, currentIndex)}
          {currentImage.caption && (
            <div className="contempo-lightbox__caption">
              {currentImage.caption}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <button
            className="contempo-lightbox__nav contempo-lightbox__nav--next"
            onClick={onNext}
            aria-label="Next image"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        )}

        <div className="contempo-lightbox__counter" aria-live="polite">
          {currentIndex + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};