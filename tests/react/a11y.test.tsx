import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { PdfAnchorViewer } from '../../src';
import type { PdfCitation } from '../../src';

vi.mock('react-pdf', async () => {
  const mock = await import('./mockPdf');
  return { Document: mock.MockDocument, Page: mock.MockPage, pdfjs: mock.pdfjs };
});

const citations: PdfCitation[] = [
  { page: 1, text: 'treated for type 2 diabetes', title: 'Condition' },
  { page: 1, text: 'admitted with chest pain', title: 'Reason' },
  { page: 2, text: 'Metformin 500 mg twice daily', title: 'Medication' },
];

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('accessibility', () => {
  it('has no axe violations (structure, names, ARIA)', async () => {
    const { container } = render(
      <PdfAnchorViewer
        file="a.pdf"
        citations={citations}
        title="Jane"
        heading="Q"
        description="D"
      />,
    );
    const results = await axe.run(container, {
      // Contrast needs real layout and is checked in the browser, see docs/accessibility.md.
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  it('exposes a named region, a named toolbar and the keyboard shortcuts', () => {
    render(<PdfAnchorViewer file="a.pdf" citations={citations} />);
    const region = screen.getByRole('region', { name: 'PDF viewer' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveAttribute('aria-keyshortcuts', expect.stringContaining('ArrowLeft'));
    expect(screen.getByRole('navigation', { name: 'PDF controls' })).toBeInTheDocument();
  });

  it('marks the current citation page link', () => {
    render(<PdfAnchorViewer file="a.pdf" citations={citations} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 2' })).not.toHaveAttribute('aria-current');
  });

  it('gives every control an accessible name', () => {
    render(<PdfAnchorViewer file="a.pdf" citations={citations} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveAccessibleName();
    }
  });
});

describe('keyboard navigation', () => {
  it('moves between citations with left and right arrows', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} />);
    screen.getByRole('region', { name: 'PDF viewer' }).focus();

    expect(screen.getByText('1 of 2')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
  });

  it('pages with up and down arrows', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} />);
    screen.getByRole('region', { name: 'PDF viewer' }).focus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('page')).toHaveAttribute('data-page', '2');
    await user.keyboard('{ArrowUp}');
    expect(screen.getByTestId('page')).toHaveAttribute('data-page', '1');
  });

  it('zooms with plus and minus', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} />);
    screen.getByRole('region', { name: 'PDF viewer' }).focus();

    await user.keyboard('+');
    expect(screen.getByText('110%')).toBeInTheDocument();
    await user.keyboard('-');
    await user.keyboard('-');
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('works when a toolbar button has focus', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} />);
    screen.getByRole('button', { name: 'Zoom in' }).focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
  });

  it('ignores shortcuts with modifiers and inside form fields', async () => {
    const user = userEvent.setup();
    render(
      <PdfAnchorViewer
        file="a.pdf"
        citations={citations}
        renderHeader={() => <input aria-label="search" />}
      />,
    );

    await user.click(screen.getByLabelText('search'));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('1 of 2')).toBeInTheDocument();

    screen.getByRole('region', { name: 'PDF viewer' }).focus();
    await user.keyboard('{Control>}{ArrowRight}{/Control}');
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
  });

  it('can be switched off', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} keyboardNavigation={false} />);
    const region = screen.getByRole('region', { name: 'PDF viewer' });
    region.focus();

    expect(region).not.toHaveAttribute('aria-keyshortcuts');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
  });
});
