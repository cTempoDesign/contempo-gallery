import type { ReactNode } from 'react';

export interface ContempoGalleryImage {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

/** Where an image is being rendered: the grid tile or the open lightbox. */
export type ContempoImageVariant = 'grid' | 'lightbox';

export interface ContempoRenderImageContext {
  index: number;
  variant: ContempoImageVariant;
  /** Default CSS class for the variant; apply it to keep the built-in styling. */
  className: string;
  /** Resolved alt text (image.alt or a numbered fallback). */
  alt: string;
}

export interface ContempoGalleryProps<T extends ContempoGalleryImage = ContempoGalleryImage> {
  images: T[];
  columns?: number;
  gap?: number;
  /** CSS aspect-ratio for grid tiles, e.g. "1" (default), "3 / 2", "1200 / 795". */
  aspectRatio?: string;
  className?: string;
  onImageClick?: (index: number, image: T) => void;
  showLightbox?: boolean;
  lightboxClassName?: string;
  /** Replace the default <img>, e.g. with next/image. */
  renderImage?: (image: T, context: ContempoRenderImageContext) => ReactNode;
  /** Extra content under the active lightbox image, e.g. a buy button. */
  renderLightboxFooter?: (image: T, index: number) => ReactNode;
}

export interface ContempoLightboxProps<T extends ContempoGalleryImage = ContempoGalleryImage> {
  images: T[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
  renderImage?: (image: T, context: ContempoRenderImageContext) => ReactNode;
  renderLightboxFooter?: (image: T, index: number) => ReactNode;
}
