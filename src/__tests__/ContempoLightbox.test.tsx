import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContempoLightbox } from '../ContempoLightbox';
import { ContempoGalleryImage } from '../types';

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

  test('empty space around the image closes, but the caption, counter and footer do not', () => {
    const { container } = render(
      <ContempoLightbox {...defaultProps} renderLightboxFooter={() => <span>Footer</span>} />
    );

    fireEvent.click(screen.getByText('First test image'));
    fireEvent.click(screen.getByText('1 of 3'));
    fireEvent.click(screen.getByText('Footer'));
    expect(defaultProps.onClose).not.toHaveBeenCalled();

    for (const cls of ['content', 'image-container', 'slide']) {
      fireEvent.click(container.querySelector(`.contempo-lightbox__${cls}`)!);
    }
    expect(defaultProps.onClose).toHaveBeenCalledTimes(3);
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

  test('restores the previous body overflow value on close', () => {
    document.body.style.overflow = 'scroll';
    const { rerender } = render(<ContempoLightbox {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<ContempoLightbox {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('scroll');
  });

  test('returns focus to the previously focused element on close', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(<ContempoLightbox {...defaultProps} />);
    expect(document.activeElement).toBe(screen.getByRole('dialog'));

    rerender(<ContempoLightbox {...defaultProps} isOpen={false} />);
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  test('renders nothing when currentIndex is out of range', () => {
    render(<ContempoLightbox {...defaultProps} currentIndex={10} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('swipe left goes to next image, swipe right to previous', () => {
    render(<ContempoLightbox {...defaultProps} />);
    const dialog = screen.getByRole('dialog');

    fireEvent.touchStart(dialog, { touches: [{ clientX: 300 }] });
    fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 100 }] });
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);

    fireEvent.touchStart(dialog, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 300 }] });
    expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
  });

  test('short touches and single images do not navigate', () => {
    const { rerender } = render(<ContempoLightbox {...defaultProps} />);
    const dialog = screen.getByRole('dialog');

    fireEvent.touchStart(dialog, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 120 }] });

    rerender(<ContempoLightbox {...defaultProps} images={[mockImages[0]]} />);
    fireEvent.touchStart(screen.getByRole('dialog'), { touches: [{ clientX: 300 }] });
    fireEvent.touchEnd(screen.getByRole('dialog'), { changedTouches: [{ clientX: 100 }] });

    expect(defaultProps.onNext).not.toHaveBeenCalled();
    expect(defaultProps.onPrev).not.toHaveBeenCalled();
  });

  test('arrow keys inside footer form fields do not navigate', () => {
    render(
      <ContempoLightbox
        {...defaultProps}
        renderLightboxFooter={() => (
          <select aria-label="Size"><option>Small</option><option>Large</option></select>
        )}
      />
    );
    const select = screen.getByLabelText('Size');
    fireEvent.keyDown(select, { key: 'ArrowRight' });
    fireEvent.keyDown(select, { key: 'ArrowLeft' });
    expect(defaultProps.onNext).not.toHaveBeenCalled();
    expect(defaultProps.onPrev).not.toHaveBeenCalled();

    fireEvent.keyDown(select, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
  test('new images slide in from the side they were navigated towards', () => {
    const { container, rerender } = render(<ContempoLightbox {...defaultProps} />);
    const slide = () => container.querySelector('.contempo-lightbox__slide');
    expect(slide()).toHaveClass('contempo-lightbox__slide--none');

    fireEvent.click(screen.getByLabelText('Next image'));
    rerender(<ContempoLightbox {...defaultProps} currentIndex={1} />);
    expect(slide()).toHaveClass('contempo-lightbox__slide--next');

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    rerender(<ContempoLightbox {...defaultProps} currentIndex={0} />);
    expect(slide()).toHaveClass('contempo-lightbox__slide--prev');

    // Closing and reopening fades in instead of sliding
    rerender(<ContempoLightbox {...defaultProps} isOpen={false} />);
    rerender(<ContempoLightbox {...defaultProps} />);
    expect(slide()).toHaveClass('contempo-lightbox__slide--none');
  });

  test('the image follows a horizontal drag and eases back when released', () => {
    const { container } = render(<ContempoLightbox {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    const slide = container.querySelector('.contempo-lightbox__slide') as HTMLElement;

    fireEvent.touchStart(dialog, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchMove(dialog, { touches: [{ clientX: 205, clientY: 200 }] });
    expect(slide.style.transform).toBe('');

    fireEvent.touchMove(dialog, { touches: [{ clientX: 170, clientY: 205 }] });
    expect(slide.style.transform).toBe('translateX(-30px)');
    expect(slide.style.transition).toBe('none');

    fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 170, clientY: 205 }] });
    expect(slide.style.transform).toBe('');
    expect(slide.style.transition).toBe('');
    expect(defaultProps.onNext).not.toHaveBeenCalled();
  });

  test('vertical moves and cancelled touches do not drag the image', () => {
    const { container } = render(<ContempoLightbox {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    const slide = container.querySelector('.contempo-lightbox__slide') as HTMLElement;

    fireEvent.touchMove(dialog, { touches: [{ clientX: 100, clientY: 100 }] });
    expect(slide.style.transform).toBe('');

    fireEvent.touchStart(dialog, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchMove(dialog, { touches: [{ clientX: 180, clientY: 300 }] });
    expect(slide.style.transform).toBe('');

    fireEvent.touchMove(dialog, { touches: [{ clientX: 100, clientY: 210 }] });
    expect(slide.style.transform).toBe('translateX(-100px)');
    fireEvent.touchCancel(dialog);
    expect(slide.style.transform).toBe('');

    fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 0, clientY: 200 }] });
    expect(defaultProps.onNext).not.toHaveBeenCalled();
  });

  test('preloads the neighbouring images, except with a custom renderImage', () => {
    const OriginalImage = window.Image;
    const loaded: string[] = [];
    window.Image = class { set src(value: string) { loaded.push(value); } } as unknown as typeof Image;
    try {
      const { rerender } = render(<ContempoLightbox {...defaultProps} />);
      expect(loaded).toEqual([mockImages[1].src, mockImages[2].src]);

      loaded.length = 0;
      rerender(<ContempoLightbox {...defaultProps} renderImage={(image, { alt }) => <img src={image.src} alt={alt} />} />);
      expect(loaded).toEqual([]);
    } finally {
      window.Image = OriginalImage;
    }
  });
  test('tapping the image hides and shows the controls', () => {
    render(<ContempoLightbox {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    const image = screen.getByAltText('Test image 1');

    fireEvent.click(image);
    expect(dialog).toHaveClass('contempo-lightbox--controls-hidden');
    expect(defaultProps.onClose).not.toHaveBeenCalled();

    // Stays hidden while navigating
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveClass('contempo-lightbox--controls-hidden');

    fireEvent.click(image);
    expect(dialog).not.toHaveClass('contempo-lightbox--controls-hidden');
  });

  test('Tab and reopening bring the controls back', () => {
    const { rerender } = render(<ContempoLightbox {...defaultProps} />);
    const dialog = () => screen.getByRole('dialog');

    fireEvent.click(screen.getByAltText('Test image 1'));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(dialog()).not.toHaveClass('contempo-lightbox--controls-hidden');

    fireEvent.click(screen.getByAltText('Test image 1'));
    rerender(<ContempoLightbox {...defaultProps} isOpen={false} />);
    rerender(<ContempoLightbox {...defaultProps} />);
    expect(dialog()).not.toHaveClass('contempo-lightbox--controls-hidden');
  });

  test('tapping a custom renderImage element toggles the controls too', () => {
    render(
      <ContempoLightbox
        {...defaultProps}
        renderImage={(image, { className, alt }) => <picture><img src={image.src} alt={alt} className={className} /></picture>}
      />
    );
    fireEvent.click(screen.getByAltText('Test image 1'));
    expect(screen.getByRole('dialog')).toHaveClass('contempo-lightbox--controls-hidden');
  });
});
