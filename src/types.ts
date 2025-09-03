export interface ContempoGalleryImage {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

export interface ContempoGalleryProps {
  images: ContempoGalleryImage[];
  columns?: number;
  gap?: number;
  className?: string;
  onImageClick?: (index: number, image: ContempoGalleryImage) => void;
  showLightbox?: boolean;
  lightboxClassName?: string;
}

export interface ContempoLightboxProps {
  images: ContempoGalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}