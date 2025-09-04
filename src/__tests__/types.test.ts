import { ContempoGalleryImage, ContempoGalleryProps, ContempoLightboxProps } from '../types';

// Type tests - these will fail at compile time if types are broken
describe('Type Definitions', () => {
  test('ContempoGalleryImage interface', () => {
    const validImage: ContempoGalleryImage = {
      src: 'https://example.com/image.jpg'
    };
    
    const fullImage: ContempoGalleryImage = {
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
      caption: 'Test caption',
      thumbnail: 'https://example.com/thumb.jpg'
    };
    
    expect(validImage.src).toBe('https://example.com/image.jpg');
    expect(fullImage.alt).toBe('Test image');
    expect(fullImage.caption).toBe('Test caption');
    expect(fullImage.thumbnail).toBe('https://example.com/thumb.jpg');
  });

  test('ContempoGalleryProps interface', () => {
    const minimalProps: ContempoGalleryProps = {
      images: []
    };
    
    const fullProps: ContempoGalleryProps = {
      images: [],
      columns: 3,
      gap: 8,
      className: 'test-class',
      onImageClick: jest.fn(),
      showLightbox: true,
      lightboxClassName: 'lightbox-class'
    };
    
    expect(minimalProps.images).toEqual([]);
    expect(fullProps.columns).toBe(3);
    expect(fullProps.gap).toBe(8);
    expect(fullProps.className).toBe('test-class');
    expect(typeof fullProps.onImageClick).toBe('function');
    expect(fullProps.showLightbox).toBe(true);
    expect(fullProps.lightboxClassName).toBe('lightbox-class');
  });

  test('ContempoLightboxProps interface', () => {
    const lightboxProps: ContempoLightboxProps = {
      images: [],
      currentIndex: 0,
      isOpen: true,
      onClose: jest.fn(),
      onNext: jest.fn(),
      onPrev: jest.fn(),
      className: 'lightbox-test'
    };
    
    expect(lightboxProps.images).toEqual([]);
    expect(lightboxProps.currentIndex).toBe(0);
    expect(lightboxProps.isOpen).toBe(true);
    expect(typeof lightboxProps.onClose).toBe('function');
    expect(typeof lightboxProps.onNext).toBe('function');
    expect(typeof lightboxProps.onPrev).toBe('function');
    expect(lightboxProps.className).toBe('lightbox-test');
  });

  test('onImageClick callback signature', () => {
    const mockCallback: ContempoGalleryProps['onImageClick'] = (index, image) => {
      expect(typeof index).toBe('number');
      expect(typeof image.src).toBe('string');
    };

    const testImage: ContempoGalleryImage = {
      src: 'https://example.com/test.jpg'
    };

    mockCallback?.(0, testImage);
  });
});