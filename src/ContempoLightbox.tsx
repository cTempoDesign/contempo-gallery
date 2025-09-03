import React, { useEffect, useCallback, useRef } from 'react';
import { ContempoLightboxProps } from './types';
import './ContempoLightbox.css';

export const ContempoLightbox: React.FC<ContempoLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
          <img
            ref={imageRef}
            src={currentImage.src}
            alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
            className="contempo-lightbox__image"
          />
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