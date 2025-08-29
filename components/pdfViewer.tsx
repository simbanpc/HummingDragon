// components/PdfViewer.tsx
'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';
type RP = typeof import('react-pdf');

function PdfViewerInner({ fileUrl = '/brochure.pdf' }: { fileUrl?: string }) {
  const [RPDF, setRPDF] = React.useState<RP | null>(null);
  const [numPages, setNumPages] = React.useState(0);
  const [width, setWidth] = React.useState<number>(1);
  const [fallback, setFallback] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Helper: resolve URLs that respect basePath/assetPrefix
  const withBase = React.useCallback((path: string) => {
    // document.baseURI already includes basePath if configured
    return new URL(path.replace(/^\//, ''), typeof document !== 'undefined' ? document.baseURI : '/').toString();
  }, []);

  // Load react-pdf after mount; point worker to same-origin path
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mod = await import('react-pdf');
          const pdfjsLib = mod.pdfjs as unknown as typeof import('pdfjs-dist');
          if (typeof Worker === 'function') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = withBase('pdf.worker.min.js'); // or '/pdf.worker.min.js'
          } else {
            // Don’t rely on disableWorker (untyped); just fallback
            setFallback(true);
            return;
          }
        if (alive) setRPDF(mod);
      } catch {
        if (alive) setFallback(true);
      }
    })();
    return () => { alive = false; };
  }, [withBase]);

  // Robust width measurement (handles initial 0 width)
  React.useEffect(() => {
    let raf = 0;
    let tries = 0;

    const measure = () => {
      const el = ref.current;
      const w = el?.getBoundingClientRect().width ?? 0;
      if (w > 10 || tries > 60) {
        setWidth(Math.min(900, Math.max(1, Math.round(w || (typeof window !== 'undefined' ? window.innerWidth : 390)))));
      } else {
        tries++;
        raf = requestAnimationFrame(measure);
      }
    };

    measure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      if (ref.current) ro.observe(ref.current);
    } else {
      // Older Safari/webviews: fall back to window resize
      window.addEventListener('resize', measure);
      window.addEventListener('orientationchange', measure);
    }
    window.addEventListener('pageshow', measure);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      window.removeEventListener('pageshow', measure);
    };
  }, []);

  // Global safety net: if any client error bubbles, switch to iframe
  React.useEffect(() => {
    const onErr = () => setFallback(true);
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onErr);
    return () => {
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onErr);
    };
  }, []);

  if (fallback) {
    // Native viewer fallback — very reliable on iOS/webviews
    return (
      <div ref={ref} style={{ width: '100%', maxWidth: 900, margin: '0 auto', minHeight: '80vh', overflowX: 'hidden' }}>
        <iframe
          src={`${withBase(fileUrl)}#toolbar=1&view=fitH`}
          title="PDF"
          style={{ position: 'relative', width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      </div>
    );
  }

  if (!RPDF) return <div ref={ref} style={{ height: '60vh' }} />;

  const { Document, Page } = RPDF;

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 900, margin: '0 auto', overflowX: 'hidden' }}>
      <Document
        file={withBase(fileUrl)}
        onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
        onLoadError={() => setFallback(true)}
        loading={<div style={{ height: '60vh' }} />}
        key={width} // force internal layout refresh when width resolves
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={`${i}-${width}`}
            pageNumber={i + 1}
            width={width}                 // width alone controls size
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfViewerInner), { ssr: false });
