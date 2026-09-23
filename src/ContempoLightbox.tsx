import React, { useEffect, useCallback, useRef } from 'react';
import { ContempoGalleryImage, ContempoLightboxProps } from './types';
import './ContempoLightbox.css';

// Minimum horizontal travel (px) for a touch gesture to count as a swipe
const SWIPE_THRESHOLD = 50;

export function ContempoLightbox<T extends ContempoGalleryImage>({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  className = '',
  renderImage,
  renderLightboxFooter
}: ContempoLightboxProps<T>) {
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    // Leave arrow keys to form fields rendered in the footer (e.g. a size <select>)
    const target = e.target as HTMLElement | null;
    if (e.key !== 'Escape' && target?.closest?.('input, select, textarea')) return;

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

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Lock page scroll and move focus into the dialog; restore both on close
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length < 2) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > SWIPE_THRESHOLD) onPrev();
    else if (deltaX < -SWIPE_THRESHOLD) onNext();
  };

  const currentImage = images[currentIndex];
  if (!isOpen || !currentImage) return null;

  const alt = currentImage.alt || `Gallery image ${currentIndex + 1}`;

  return (
    <div
      ref={modalRef}
      className={`contempo-lightbox ${className}`.trim()}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      tabIndex={-1}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="contempo-lightbox__content">
        <button
          className="contempo-lightbox__close"
          onClick={onClose}
          aria-label="Close lightbox"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        )}

        <div className="contempo-lightbox__image-container">
          {renderImage ? (
            renderImage(currentImage, { index: currentIndex, variant: 'lightbox', className: 'contempo-lightbox__image', alt })
          ) : (
            <img
              src={currentImage.src}
              alt={alt}
              className="contempo-lightbox__image"
            />
          )}
          {currentImage.caption && (
            <div className="contempo-lightbox__caption">
              {currentImage.caption}
            </div>
          )}
          <div className="contempo-lightbox__counter" aria-live="polite">
            {currentIndex + 1} of {images.length}
          </div>
          {renderLightboxFooter && (
            <div className="contempo-lightbox__footer">
              {renderLightboxFooter(currentImage, currentIndex)}
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        )}

      </div>
    </div>
  );
}
