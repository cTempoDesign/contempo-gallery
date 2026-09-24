import React, { useEffect, useCallback, useRef, useState } from 'react';
import { ContempoGalleryImage, ContempoLightboxProps } from './types';
import './ContempoLightbox.css';

// Minimum horizontal travel (px) for a touch gesture to count as a swipe
const SWIPE_THRESHOLD = 50;
// Horizontal travel (px) before a touch starts dragging the image, so taps and vertical scrolls don't
const DRAG_START = 10;

type SlideDirection = 'next' | 'prev' | 'none';

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
  const slideRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  // Which side the next image slides in from
  const [direction, setDirection] = useState<SlideDirection>('none');

  const goNext = useCallback(() => {
    setDirection('next');
    onNext();
  }, [onNext]);

  const goPrev = useCallback(() => {
    setDirection('prev');
    onPrev();
  }, [onPrev]);

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
        goPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goNext();
        break;
    }
  }, [isOpen, onClose, goNext, goPrev]);

  // The layout wrappers fill the screen, so a click on any of them (not on the image or controls) is a backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).hasAttribute('data-contempo-backdrop')) {
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

  // Warm the browser cache for the neighbouring images so navigating never shows a blank frame.
  // Skipped with renderImage, which may load a different URL (e.g. next/image).
  useEffect(() => {
    if (!isOpen || renderImage || images.length < 2) return;
    const count = images.length;
    for (const i of [currentIndex + 1, currentIndex - 1 + count]) {
      const image = images[i % count];
      if (image) new Image().src = image.src;
    }
  }, [isOpen, renderImage, images, currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    dragging.current = false;
  };

  // The image follows the finger; styles are set directly to avoid a re-render per frame
  const handleTouchMove = (e: React.TouchEvent) => {
    const start = touchStart.current;
    const slide = slideRef.current;
    if (!start || !slide || images.length < 2) return;
    const deltaX = e.touches[0].clientX - start.x;
    if (!dragging.current) {
      if (Math.abs(deltaX) < DRAG_START || Math.abs(deltaX) < Math.abs(e.touches[0].clientY - start.y)) return;
      dragging.current = true;
      slide.style.transition = 'none';
    }
    slide.style.transform = `translateX(${deltaX}px)`;
  };

  // Release the drag: the image eases back unless the swipe navigates away
  const resetDrag = () => {
    touchStart.current = null;
    dragging.current = false;
    const slide = slideRef.current;
    if (slide) {
      slide.style.transition = '';
      slide.style.transform = '';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    resetDrag();
    if (!start || images.length < 2) return;
    const deltaX = e.changedTouches[0].clientX - start.x;
    if (deltaX > SWIPE_THRESHOLD) goPrev();
    else if (deltaX < -SWIPE_THRESHOLD) goNext();
  };

  const currentImage = images[currentIndex];
  if (!isOpen || !currentImage) {
    // Reopening fades in rather than sliding from the last direction
    if (direction !== 'none') setDirection('none');
    return null;
  }

  const alt = currentImage.alt || `Gallery image ${currentIndex + 1}`;

  return (
    <div
      ref={modalRef}
      className={`contempo-lightbox ${className}`.trim()}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      data-contempo-backdrop=""
      tabIndex={-1}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={resetDrag}
    >
      <div className="contempo-lightbox__content" data-contempo-backdrop="">
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
            onClick={goPrev}
            aria-label="Previous image"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        )}

        <div className="contempo-lightbox__image-container" data-contempo-backdrop="">
          {/* Keyed by index so each image mounts fresh and plays its slide-in animation */}
          <div
            key={currentIndex}
            ref={slideRef}
            className={`contempo-lightbox__slide contempo-lightbox__slide--${direction}`}
            data-contempo-backdrop=""
          >
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
          </div>
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
            onClick={goNext}
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
