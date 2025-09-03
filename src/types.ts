export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

export interface GalleryProps {
  images: GalleryImage[];
  columns?: number;
  gap?: number;
  className?: string;
  onImageClick?: (index: number, image: GalleryImage) => void;
  showLightbox?: boolean;
  lightboxClassName?: string;
}

export interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}