import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PdfAnchorViewer } from '../../src';
import type { PdfCitation } from '../../src';
import { documentProps } from './mockPdf';

vi.mock('react-pdf', async () => {
  const mock = await import('./mockPdf');
  return { Document: mock.MockDocument, Page: mock.MockPage, pdfjs: mock.pdfjs };
});

const citations: PdfCitation[] = [
  { page: 1, text: 'treated for type 2 diabetes', title: 'Condition', color: '#e11d48' },
  { page: 1, text: 'admitted with chest pain', title: 'Reason' },
  { page: 2, text: 'Metformin 500 mg twice daily', title: 'Medication' },
  { page: 3, text: 'this passage is missing', title: 'Missing' },
];

const highlighted = () =>
  Array.from(document.querySelectorAll('.pdf-anchor-highlight')).map((el) => el.textContent);

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('PdfAnchorViewer', () => {
  it('opens on the first citation page and highlights its passage', () => {
    render(
      <PdfAnchorViewer file="a.pdf" citations={citations} title="Jane" subtitle="record.pdf" />,
    );

    expect(screen.getByTestId('page')).toHaveAttribute('data-page', '1');
    expect(screen.getByRole('heading', { level: 1, name: 'Jane' })).toBeInTheDocument();
    expect(highlighted()).toEqual(
      expect.arrayContaining([
        'treated for type 2',
        'diabetes.',
        'Patient was admitted',
        'with chest pain and',
      ]),
    );
    expect(document.querySelector('.pdf-anchor-highlight--active')).not.toBeNull();
  });

  it('shows the active citation and cycles through the page citations', async () => {
    const user = userEvent.setup();
    const onActive = vi.fn();
    render(
      <PdfAnchorViewer file="a.pdf" citations={citations} onActiveCitationChange={onActive} />,
    );

    expect(screen.getByText('treated for type 2 diabetes')).toBeInTheDocument();
    expect(screen.getByText('1 of 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next citation' }));
    expect(screen.getByText('admitted with chest pain')).toBeInTheDocument();
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
    expect(onActive).toHaveBeenLastCalledWith(1, citations[1]);
    expect(screen.getByRole('button', { name: 'Next citation' })).toBeDisabled();
  });

  it('jumps pages through the citation page links', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Page 2' }));

    expect(screen.getByTestId('page')).toHaveAttribute('data-page', '2');
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText('Metformin 500 mg twice daily')).toBeInTheDocument();
    expect(highlighted()).toEqual(['Metformin 500 mg', 'twice daily with meals.']);
  });

  it('walks the whole document in document scope', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} citationScope="document" />);

    expect(screen.getByText('1 of 4')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next citation' }));
    await user.click(screen.getByRole('button', { name: 'Next citation' }));

    expect(screen.getByTestId('page')).toHaveAttribute('data-page', '2');
    expect(screen.getByText('3 of 4')).toBeInTheDocument();
  });

  it('warns when the active citation cannot be located', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} initialPage={3} />);

    expect(screen.getByRole('status')).toHaveTextContent(/could not be located/i);
    expect(highlighted()).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'Page 1' }));
    expect(screen.queryByText(/could not be located/i)).not.toBeInTheDocument();
  });

  it('activates a citation when its highlight is clicked', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} />);

    await user.click(screen.getByText('with chest pain and'));
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
  });

  it('zooms within bounds and rotates', async () => {
    const user = userEvent.setup();
    render(<PdfAnchorViewer file="a.pdf" citations={citations} minScale={90} maxScale={110} />);

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByText('110%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
    expect(screen.getByTestId('page')).toHaveAttribute('data-scale', '1.1');

    await user.click(screen.getByRole('button', { name: 'Rotate left' }));
    expect(screen.getByTestId('page')).toHaveAttribute('data-rotate', '270');
    await user.click(screen.getByRole('button', { name: 'Rotate right' }));
    expect(screen.getByTestId('page')).toHaveAttribute('data-rotate', '0');
  });

  it('falls back to the second file when the first fails', () => {
    render(<PdfAnchorViewer file="broken.pdf" fallbackFile="ok.pdf" citations={citations} />);
    expect(documentProps.current.file).toBe('ok.pdf');
  });

  it('reports load errors when there is no fallback', () => {
    const onLoadError = vi.fn();
    render(<PdfAnchorViewer file="broken.pdf" citations={citations} onLoadError={onLoadError} />);
    expect(onLoadError).toHaveBeenCalledOnce();
  });

  it('does not re-run matching for structurally identical inline citations', () => {
    const onHighlight = vi.fn();
    const { rerender } = render(
      <PdfAnchorViewer
        file="a.pdf"
        citations={[{ page: 1, text: 'chest pain' }]}
        onHighlight={onHighlight}
      />,
    );
    const calls = onHighlight.mock.calls.length;

    rerender(
      <PdfAnchorViewer
        file="a.pdf"
        citations={[{ page: 1, text: 'chest pain' }]}
        onHighlight={onHighlight}
      />,
    );
    expect(onHighlight.mock.calls.length).toBe(calls);
  });

  it('supports theming, class and style overrides, and labels', () => {
    const { container } = render(
      <PdfAnchorViewer
        file="a.pdf"
        citations={citations}
        theme={{ accent: '#ff00aa', radius: '0px' }}
        colorScheme="dark"
        className="my-viewer"
        classNames={{ panel: 'my-panel' }}
        styles={{ header: { background: 'black' } }}
        title="T"
        labels={{ citationOf: (c, t) => `${c}/${t}` }}
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('pdf-anchor', 'my-viewer');
    expect(root).toHaveAttribute('data-color-scheme', 'dark');
    expect(root.style.getPropertyValue('--pdf-anchor-accent')).toBe('#ff00aa');
    expect(document.querySelector('.pdf-anchor__panel')).toHaveClass('my-panel');
    expect(screen.getByRole('banner')).toHaveStyle({ background: 'black' });
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('lets consumers replace the built-in parts', () => {
    render(
      <PdfAnchorViewer
        file="a.pdf"
        citations={citations}
        renderHeader={({ state }) => <div data-testid="h">page {state.page}</div>}
        renderPanel={({ state }) => <div data-testid="p">{state.activeCitation?.title}</div>}
        renderToolbar={({ state }) => <div data-testid="t">{state.citationPages.join('+')}</div>}
      />,
    );

    expect(screen.getByTestId('h')).toHaveTextContent('page 1');
    expect(screen.getByTestId('p')).toHaveTextContent('Condition');
    expect(screen.getByTestId('t')).toHaveTextContent('1+2+3');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('can hide header, panel and toolbar', () => {
    render(
      <PdfAnchorViewer
        file="a.pdf"
        citations={citations}
        showHeader={false}
        showPanel={false}
        showToolbar={false}
      />,
    );
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(within(document.body).queryByText('Condition')).not.toBeInTheDocument();
  });
});
