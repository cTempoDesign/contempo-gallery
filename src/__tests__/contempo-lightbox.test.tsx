import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContempoLightbox } from '../contempo-lightbox';
import { ContempoGalleryImage, RenderImageProps } from '../types';

const mockImages: ContempoGalleryImage[] = [
  {
    src: 'https://example.com/image1.jpg',
    alt: 'Test image 1',
    caption: 'First test image'
  },
  {
    src: 'https://example.com/image2.jpg',
    alt: 'Test image 2',
    caption: 'Second test image'
  },
  {
    src: 'https://example.com/image3.jpg',
    alt: 'Test image 3'
  }
];

const defaultProps = {
  images: mockImages,
  currentIndex: 0,
  isOpen: true,
  onClose: jest.fn(),
  onNext: jest.fn(),
  onPrev: jest.fn()
};

describe('ContempoLightbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Clean up any event listeners
    document.removeEventListener('keydown', jest.fn());
  });

  test('does not render when isOpen is false', () => {
    render(<ContempoLightbox {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('does not render when images array is empty', () => {
    render(<ContempoLightbox {...defaultProps} images={[]} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders lightbox when isOpen is true', () => {
    render(<ContempoLightbox {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-label', 'Image lightbox');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('displays current image with correct src and alt', () => {
    render(<ContempoLightbox {...defaultProps} currentIndex={1} />);
    
    const image = screen.getByAltText('Test image 2');
    expect(image).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  test('displays caption when image has one', () => {
    render(<ContempoLightbox {...defaultProps} />);
    
    expect(screen.getByText('First test image')).toBeInTheDocument();
  });

  test('does not display caption when image lacks one', () => {
    render(<ContempoLightbox {...defaultProps} currentIndex={2} />);
    
    expect(screen.queryByText('Third test image')).not.toBeInTheDocument();
  });

  test('displays image counter', () => {
    render(<ContempoLightbox {...defaultProps} currentIndex={1} />);
    
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<ContempoLightbox {...defaultProps} className="custom-lightbox" />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('contempo-lightbox', 'custom-lightbox');
  });

  test('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();
    
    render(<ContempoLightbox {...defaultProps} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close lightbox');
    
    await act(async () => {
      await user.click(closeButton);
    });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();
    
    render(<ContempoLightbox {...defaultProps} onClose={mockOnClose} />);
    
    const dialog = screen.getByRole('dialog');
    
    await act(async () => {
      await user.click(dialog);
    });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when clicking on content', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();
    
    render(<ContempoLightbox {...defaultProps} onClose={mockOnClose} />);
    
    const image = screen.getByAltText('Test image 1');
    
    await act(async () => {
      await user.click(image);
    });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('shows navigation buttons when there are multiple images', () => {
    render(<ContempoLightbox {...defaultProps} />);
    
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  test('does not show navigation buttons when there is only one image', () => {
    const singleImage = [mockImages[0]];
    render(<ContempoLightbox {...defaultProps} images={singleImage} />);
    
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  test('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnNext = jest.fn();
    
    render(<ContempoLightbox {...defaultProps} onNext={mockOnNext} />);
    
    const nextButton = screen.getByLabelText('Next image');
    
    await act(async () => {
      await user.click(nextButton);
    });
    
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  test('calls onPrev when previous button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnPrev = jest.fn();
    
    render(<ContempoLightbox {...defaultProps} onPrev={mockOnPrev} />);
    
    const prevButton = screen.getByLabelText('Previous image');
    
    await act(async () => {
      await user.click(prevButton);
    });
    
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });

  test('handles keyboard navigation - Escape key', () => {
    const mockOnClose = jest.fn();
    render(<ContempoLightbox {...defaultProps} onClose={mockOnClose} />);
    
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('handles keyboard navigation - Arrow Right key', () => {
    const mockOnNext = jest.fn();
    render(<ContempoLightbox {...defaultProps} onNext={mockOnNext} />);
    
    act(() => {
      fireEvent.keyDown(document, { key: 'ArrowRight' });
    });
    
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  test('handles keyboard navigation - Arrow Left key', () => {
    const mockOnPrev = jest.fn();
    render(<ContempoLightbox {...defaultProps} onPrev={mockOnPrev} />);
    
    act(() => {
      fireEvent.keyDown(document, { key: 'ArrowLeft' });
    });
    
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });

  test('ignores keyboard events when lightbox is closed', () => {
    const mockOnClose = jest.fn();
    const mockOnNext = jest.fn();
    const mockOnPrev = jest.fn();
    
    render(
      <ContempoLightbox 
        {...defaultProps} 
        isOpen={false}
        onClose={mockOnClose}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );
    
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      fireEvent.keyDown(document, { key: 'ArrowLeft' });
    });
    
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnNext).not.toHaveBeenCalled();
    expect(mockOnPrev).not.toHaveBeenCalled();
  });

  test('sets body overflow to hidden when open', () => {
    render(<ContempoLightbox {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('restores body overflow when closed', () => {
    const { rerender } = render(<ContempoLightbox {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<ContempoLightbox {...defaultProps} isOpen={false} />);
    
    expect(document.body.style.overflow).toBe('');
  });

  test('focuses modal when opened', () => {
    render(<ContempoLightbox {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();
  });

  test('generates default alt text when image has no alt', () => {
    const imageWithoutAlt: ContempoGalleryImage = {
      src: 'https://example.com/image.jpg'
    };
    
    render(
      <ContempoLightbox 
        {...defaultProps} 
        images={[imageWithoutAlt]} 
        currentIndex={0} 
      />
    );
    
    expect(screen.getByAltText('Gallery image 1')).toBeInTheDocument();
  });

  test('handles component unmounting cleanly', () => {
    const { unmount } = render(<ContempoLightbox {...defaultProps} />);
    
    // Should not throw errors
    unmount();
    
    expect(document.body.style.overflow).toBe('');
  });

  test('counter has live region for screen readers', () => {
    render(<ContempoLightbox {...defaultProps} />);
    
    const counter = screen.getByText('1 of 3');
    expect(counter).toHaveAttribute('aria-live', 'polite');
  });

  test('prevents default on arrow key events', () => {
    render(<ContempoLightbox {...defaultProps} />);
    
    const arrowRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    const arrowLeftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    
    const preventDefaultSpy = jest.spyOn(arrowRightEvent, 'preventDefault');
    const preventDefaultSpy2 = jest.spyOn(arrowLeftEvent, 'preventDefault');
    
    fireEvent(document, arrowRightEvent);
    fireEvent(document, arrowLeftEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(preventDefaultSpy2).toHaveBeenCalled();
  });

  test('does not prevent default on non-arrow key events', () => {
    render(<ContempoLightbox {...defaultProps} />);
    
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    const preventDefaultSpy = jest.spyOn(escapeEvent, 'preventDefault');
    
    fireEvent(document, escapeEvent);
    
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<ContempoLightbox {...defaultProps} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  describe('Next.js Image Integration', () => {
    const MockNextImage = jest.fn(({ src, alt, className, ...props }) => (
      <img
        src={src}
        alt={alt}
        className={className}
        data-testid="lightbox-next-image"
        data-props={JSON.stringify(props)}
      />
    ));

    beforeEach(() => {
      MockNextImage.mockClear();
    });

    test('uses Next.js Image when NextImage component and useNextImage are provided', () => {
      render(
        <ContempoLightbox
          {...defaultProps}
          NextImage={MockNextImage}
          useNextImage={true}
        />
      );

      expect(screen.getByTestId('lightbox-next-image')).toBeInTheDocument();
      expect(MockNextImage).toHaveBeenCalledTimes(1);
    });

    test('passes Next.js specific props from image data', () => {
      const imagesWithNextProps: ContempoGalleryImage[] = [
        {
          src: 'https://example.com/image1.jpg',
          alt: 'Test image 1',
          width: 1200,
          height: 800,
          quality: 90,
          priority: true,
          fill: true
        }
      ];

      render(
        <ContempoLightbox
          {...defaultProps}
          images={imagesWithNextProps}
          NextImage={MockNextImage}
          useNextImage={true}
        />
      );

      expect(MockNextImage).toHaveBeenCalledWith(
        expect.objectContaining({
          src: 'https://example.com/image1.jpg',
          alt: 'Test image 1',
          width: 1200,
          height: 800,
          quality: 90,
          priority: true,
          fill: true,
          loading: 'eager'
        }),
        expect.any(Object)
      );
    });

    test('passes nextImageProps to Next.js Image component', () => {
      const nextImageProps = {
        sizes: '100vw',
        placeholder: 'blur' as const,
        blurDataURL: 'data:image/svg+xml;base64,placeholder'
      };

      render(
        <ContempoLightbox
          {...defaultProps}
          NextImage={MockNextImage}
          useNextImage={true}
          nextImageProps={nextImageProps}
        />
      );

      expect(MockNextImage).toHaveBeenCalledWith(
        expect.objectContaining(nextImageProps),
        expect.any(Object)
      );
    });

    test('falls back to native img when useNextImage is false', () => {
      render(
        <ContempoLightbox
          {...defaultProps}
          NextImage={MockNextImage}
          useNextImage={false}
        />
      );

      const nativeImage = screen.getByRole('dialog').querySelector('img');
      expect(nativeImage).toBeInTheDocument();
      expect(screen.queryByTestId('lightbox-next-image')).not.toBeInTheDocument();
      expect(MockNextImage).not.toHaveBeenCalled();
    });

    test('falls back to native img when NextImage is not provided', () => {
      render(
        <ContempoLightbox
          {...defaultProps}
          useNextImage={true}
        />
      );

      const nativeImage = screen.getByRole('dialog').querySelector('img');
      expect(nativeImage).toBeInTheDocument();
      expect(screen.queryByTestId('lightbox-next-image')).not.toBeInTheDocument();
      expect(MockNextImage).not.toHaveBeenCalled();
    });
  });

  describe('Custom renderImage prop', () => {
    test('uses custom renderImage when provided', () => {
      const customRenderImage = jest.fn((props: RenderImageProps) => (
        <div data-testid="custom-lightbox-image">
          <span>Custom: {props.image.src}</span>
        </div>
      ));

      render(
        <ContempoLightbox
          {...defaultProps}
          renderImage={customRenderImage}
        />
      );

      expect(screen.getByTestId('custom-lightbox-image')).toBeInTheDocument();
      expect(customRenderImage).toHaveBeenCalledTimes(1);
    });

    test('renderImage receives correct props for lightbox', () => {
      const customRenderImage = jest.fn((props: RenderImageProps) => (
        <div data-testid="custom-lightbox-image" />
      ));

      render(
        <ContempoLightbox
          {...defaultProps}
          renderImage={customRenderImage}
        />
      );

      expect(customRenderImage).toHaveBeenCalledWith(
        expect.objectContaining({
          image: mockImages[0],
          index: 0,
          isLightbox: true,
          className: 'contempo-lightbox__image',
          loading: 'eager'
        })
      );
    });

    test('renderImage takes precedence over Next.js Image in lightbox', () => {
      const MockNextImage = jest.fn(() => <img data-testid="lightbox-next-image" />);
      const customRenderImage = jest.fn((props: RenderImageProps) => (
        <div data-testid="custom-lightbox-image" />
      ));

      render(
        <ContempoLightbox
          {...defaultProps}
          NextImage={MockNextImage}
          useNextImage={true}
          renderImage={customRenderImage}
        />
      );

      expect(screen.getByTestId('custom-lightbox-image')).toBeInTheDocument();
      expect(screen.queryByTestId('lightbox-next-image')).not.toBeInTheDocument();
      expect(MockNextImage).not.toHaveBeenCalled();
    });
  });
});