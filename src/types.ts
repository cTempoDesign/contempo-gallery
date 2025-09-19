import React from 'react';

export interface ContempoGalleryImage {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
  // Next.js Image specific props (optional)
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Generic image component type that can be either native img or Next.js Image
export type ImageComponent = React.ComponentType<any>;

// Render prop function for custom image rendering
export interface RenderImageProps {
  image: ContempoGalleryImage;
  index: number;
  isLightbox?: boolean;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
  'aria-label'?: string;
  loading?: 'lazy' | 'eager';
}

export type RenderImageFunction = (props: RenderImageProps) => React.ReactNode;

export interface ContempoGalleryProps {
  images: ContempoGalleryImage[];
  columns?: number;
  gap?: number;
  className?: string;
  onImageClick?: (index: number, image: ContempoGalleryImage) => void;
  showLightbox?: boolean;
  lightboxClassName?: string;
  // Next.js Image support
  NextImage?: ImageComponent;
  useNextImage?: boolean;
  // Custom render prop for full override
  renderImage?: RenderImageFunction;
  // Additional Next.js specific props
  nextImageProps?: Record<string, any>;
}

export interface ContempoLightboxProps {
  images: ContempoGalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
  // Next.js Image support for lightbox
  NextImage?: ImageComponent;
  useNextImage?: boolean;
  renderImage?: RenderImageFunction;
  nextImageProps?: Record<string, any>;
}