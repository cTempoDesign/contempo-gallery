import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContempoGallery } from '../contempo-gallery';
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
    caption: 'Second test image',
    thumbnail: 'https://example.com/thumb2.jpg'
  },
  {
    src: 'https://example.com/image3.jpg',
    alt: 'Test image 3'
  }
];

describe('ContempoGallery', () => {
  beforeEach(() => {
    // Reset document body overflow
    document.body.style.overflow = '';
  });

  test('renders gallery with correct number of images', () => {
    render(<ContempoGallery images={mockImages} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  test('displays images with correct src and alt attributes', () => {
    render(<ContempoGallery images={mockImages} />);
    
    const image1 = screen.getByAltText('Test image 1');
    const image2 = screen.getByAltText('Test image 2');
    const image3 = screen.getByAltText('Test image 3');
    
    expect(image1).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(image2).toHaveAttribute('src', 'https://example.com/thumb2.jpg'); // Uses thumbnail
    expect(image3).toHaveAttribute('src', 'https://example.com/image3.jpg');
  });

  test('applies custom CSS variables for columns and gap', () => {
    render(<ContempoGallery images={mockImages} columns={4} gap={16} />);
    
    const gallery = screen.getByRole('grid');
    expect(gallery).toHaveStyle({
      '--gallery-columns': '4',
      '--gallery-gap': '16px'
    });
  });

  test('applies custom className', () => {
    render(<ContempoGallery images={mockImages} className="custom-gallery" />);
    
    const gallery = screen.getByRole('grid');
    expect(gallery).toHaveClass('contempo-gallery', 'custom-gallery');
  });

  test('displays captions for images that have them', () => {
    render(<ContempoGallery images={mockImages} />);
    
    expect(screen.getByText('First test image')).toBeInTheDocument();
    expect(screen.getByText('Second test image')).toBeInTheDocument();
    expect(screen.queryByText('Test image 3')).not.toBeInTheDocument(); // No caption
  });

  test('opens lightbox when image is clicked', async () => {
    const user = userEvent.setup();
    render(<ContempoGallery images={mockImages} />);
    
    const firstImage = screen.getByAltText('Test image 1');
    
    await act(async () => {
      await user.click(firstImage);
    });
    
    // Check if lightbox is rendered
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('calls onImageClick callback when provided', async () => {
    const mockOnImageClick = jest.fn();
    const user = userEvent.setup();
    
    render(<ContempoGallery images={mockImages} onImageClick={mockOnImageClick} />);
    
    const secondImage = screen.getByAltText('Test image 2');
    
    await act(async () => {
      await user.click(secondImage);
    });
    
    expect(mockOnImageClick).toHaveBeenCalledWith(1, mockImages[1]);
  });

  test('does not show lightbox when showLightbox is false', async () => {
    const user = userEvent.setup();
    render(<ContempoGallery images={mockImages} showLightbox={false} />);
    
    const firstImage = screen.getByAltText('Test image 1');
    
    await act(async () => {
      await user.click(firstImage);
    });
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('supports keyboard navigation on gallery items', async () => {
    const user = userEvent.setup();
    render(<ContempoGallery images={mockImages} />);
    
    const galleryItems = screen.getAllByRole('gridcell');
    const firstItem = galleryItems[0];
    
    // Focus the first item
    act(() => {
      firstItem.focus();
    });
    expect(firstItem).toHaveFocus();
    
    // Press Enter to open lightbox
    await act(async () => {
      await user.keyboard('{Enter}');
    });
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('supports space key to open lightbox', async () => {
    const user = userEvent.setup();
    render(<ContempoGallery images={mockImages} />);
    
    const galleryItems = screen.getAllByRole('gridcell');
    const firstItem = galleryItems[0];
    
    act(() => {
      firstItem.focus();
    });
    
    await act(async () => {
      await user.keyboard(' ');
    });
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('has proper ARIA labels', () => {
    render(<ContempoGallery images={mockImages} />);
    
    const gallery = screen.getByRole('grid');
    expect(gallery).toHaveAttribute('aria-label', 'Image gallery');
    
    const galleryItems = screen.getAllByRole('gridcell');
    expect(galleryItems[0]).toHaveAttribute('aria-label', 'Image 1 of 3: Test image 1');
    expect(galleryItems[1]).toHaveAttribute('aria-label', 'Image 2 of 3: Test image 2');
    expect(galleryItems[2]).toHaveAttribute('aria-label', 'Image 3 of 3: Test image 3');
  });

  test('handles empty images array gracefully', () => {
    render(<ContempoGallery images={[]} />);
    
    const gallery = screen.getByRole('grid');
    expect(gallery).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('handles images without alt text', () => {
    const imagesWithoutAlt: ContempoGalleryImage[] = [
      { src: 'https://example.com/image1.jpg' }
    ];
    
    render(<ContempoGallery images={imagesWithoutAlt} />);
    
    const image = screen.getByAltText('Gallery image 1');
    expect(image).toBeInTheDocument();
  });

  test('applies lightboxClassName to lightbox', async () => {
    const user = userEvent.setup();
    render(<ContempoGallery images={mockImages} lightboxClassName="custom-lightbox" />);
    
    const firstImage = screen.getByAltText('Test image 1');
    
    await act(async () => {
      await user.click(firstImage);
    });
    
    await waitFor(() => {
      const lightbox = screen.getByRole('dialog');
      expect(lightbox).toHaveClass('contempo-lightbox', 'custom-lightbox');
    });
  });

  test('closes lightbox when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ContempoGallery images={mockImages} />);
    
    // Open lightbox
    const firstImage = screen.getByAltText('Test image 1');
    
    await act(async () => {
      await user.click(firstImage);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Close lightbox
    const closeButton = screen.getByLabelText('Close lightbox');
    
    await act(async () => {
      await user.click(closeButton);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('navigates between images in lightbox', async () => {
    const user = userEvent.setup();
    render(<ContempoGallery images={mockImages} />);
    
    // Open lightbox with first image
    const firstImage = screen.getByAltText('Test image 1');
    
    await act(async () => {
      await user.click(firstImage);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Check first image is displayed
    const lightboxImage = screen.getByRole('dialog').querySelector('img');
    expect(lightboxImage).toHaveAttribute('src', 'https://example.com/image1.jpg');
    
    // Click next button
    const nextButton = screen.getByLabelText('Next image');
    
    await act(async () => {
      await user.click(nextButton);
    });
    
    // Check second image is displayed
    await waitFor(() => {
      const updatedLightboxImage = screen.getByRole('dialog').querySelector('img');
      expect(updatedLightboxImage).toHaveAttribute('src', 'https://example.com/image2.jpg');
    });
  });

  test('wraps around when navigating past last image', async () => {
    const user = userEvent.setup();
    render(<ContempoGallery images={mockImages} />);
    
    // Open lightbox with last image
    const lastImage = screen.getByAltText('Test image 3');
    
    await act(async () => {
      await user.click(lastImage);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Click next to wrap to first image
    const nextButton = screen.getByLabelText('Next image');
    
    await act(async () => {
      await user.click(nextButton);
    });
    
    await waitFor(() => {
      const lightboxImage = screen.getByRole('dialog').querySelector('img');
      expect(lightboxImage).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });
  });

  describe('Next.js Image Integration', () => {
    const MockNextImage = jest.fn(({ src, alt, className, ...props }) => (
      <img
        src={src}
        alt={alt}
        className={className}
        data-testid="gallery-next-image"
        data-props={JSON.stringify(props)}
      />
    ));

    beforeEach(() => {
      MockNextImage.mockClear();
    });

    test('uses Next.js Image when NextImage component and useNextImage are provided', () => {
      render(
        <ContempoGallery
          images={mockImages}
          NextImage={MockNextImage}
          useNextImage={true}
        />
      );

      const nextImages = screen.getAllByTestId('gallery-next-image');
      expect(nextImages).toHaveLength(3);
      expect(MockNextImage).toHaveBeenCalledTimes(3);
    });

    test('passes Next.js specific props from image data', () => {
      const imagesWithNextProps: ContempoGalleryImage[] = [
        {
          src: 'https://example.com/image1.jpg',
          alt: 'Test image 1',
          width: 800,
          height: 600,
          quality: 90,
          priority: true
        }
      ];

      render(
        <ContempoGallery
          images={imagesWithNextProps}
          NextImage={MockNextImage}
          useNextImage={true}
        />
      );

      expect(MockNextImage).toHaveBeenCalledWith(
        expect.objectContaining({
          src: 'https://example.com/image1.jpg',
          alt: 'Test image 1',
          width: 800,
          height: 600,
          quality: 90,
          priority: true
        }),
        expect.any(Object)
      );
    });

    test('passes nextImageProps to Next.js Image component', () => {
      const nextImageProps = {
        sizes: '(max-width: 768px) 100vw, 50vw',
        placeholder: 'blur' as const
      };

      render(
        <ContempoGallery
          images={mockImages}
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
        <ContempoGallery
          images={mockImages}
          NextImage={MockNextImage}
          useNextImage={false}
        />
      );

      const nativeImages = screen.getAllByRole('img');
      expect(nativeImages).toHaveLength(3);
      expect(MockNextImage).not.toHaveBeenCalled();
    });

    test('falls back to native img when NextImage is not provided', () => {
      render(
        <ContempoGallery
          images={mockImages}
          useNextImage={true}
        />
      );

      const nativeImages = screen.getAllByRole('img');
      expect(nativeImages).toHaveLength(3);
      expect(MockNextImage).not.toHaveBeenCalled();
    });
  });

  describe('Custom renderImage prop', () => {
    test('uses custom renderImage when provided', () => {
      const customRenderImage = jest.fn((props: RenderImageProps) => (
        <div data-testid="custom-image">
          <span>Custom: {props.image.src}</span>
        </div>
      ));

      render(
        <ContempoGallery
          images={mockImages}
          renderImage={customRenderImage}
        />
      );

      const customImages = screen.getAllByTestId('custom-image');
      expect(customImages).toHaveLength(3);
      expect(customRenderImage).toHaveBeenCalledTimes(3);
    });

    test('renderImage receives correct props', () => {
      const customRenderImage = jest.fn((props: RenderImageProps) => (
        <div data-testid="custom-image" />
      ));

      render(
        <ContempoGallery
          images={mockImages}
          renderImage={customRenderImage}
        />
      );

      expect(customRenderImage).toHaveBeenCalledWith(
        expect.objectContaining({
          image: mockImages[0],
          index: 0,
          isLightbox: false,
          className: 'contempo-gallery__image',
          loading: 'lazy'
        })
      );
    });

    test('renderImage takes precedence over Next.js Image', () => {
      const MockNextImage = jest.fn(() => <img data-testid="gallery-next-image" />);
      const customRenderImage = jest.fn((props: RenderImageProps) => (
        <div data-testid="custom-image" />
      ));

      render(
        <ContempoGallery
          images={mockImages}
          NextImage={MockNextImage}
          useNextImage={true}
          renderImage={customRenderImage}
        />
      );

      expect(screen.getAllByTestId('custom-image')).toHaveLength(3);
      expect(screen.queryByTestId('gallery-next-image')).not.toBeInTheDocument();
      expect(MockNextImage).not.toHaveBeenCalled();
    });
  });

  describe('Lightbox Next.js Image Integration', () => {
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

    test('lightbox uses Next.js Image when provided', async () => {
      const user = userEvent.setup();
      render(
        <ContempoGallery
          images={mockImages}
          NextImage={MockNextImage}
          useNextImage={true}
        />
      );

      const firstImage = screen.getByAltText('Test image 1');

      await act(async () => {
        await user.click(firstImage);
      });

      await waitFor(() => {
        const lightboxDialog = screen.getByRole('dialog');
        const lightboxImage = lightboxDialog.querySelector('[data-testid="lightbox-next-image"]');
        expect(lightboxImage).toBeInTheDocument();
      });
    });

    test('lightbox passes through Next.js props correctly', async () => {
      const user = userEvent.setup();
      const imagesWithNextProps: ContempoGalleryImage[] = [
        {
          src: 'https://example.com/image1.jpg',
          alt: 'Test image 1',
          width: 1200,
          height: 800,
          priority: true
        }
      ];

      render(
        <ContempoGallery
          images={imagesWithNextProps}
          NextImage={MockNextImage}
          useNextImage={true}
        />
      );

      const firstImage = screen.getByAltText('Test image 1');

      await act(async () => {
        await user.click(firstImage);
      });

      await waitFor(() => {
        expect(MockNextImage).toHaveBeenCalledWith(
          expect.objectContaining({
            src: 'https://example.com/image1.jpg',
            alt: 'Test image 1',
            width: 1200,
            height: 800,
            priority: true,
            loading: 'eager'
          }),
          expect.any(Object)
        );
      });
    });
  });
});