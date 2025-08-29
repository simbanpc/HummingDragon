// components/pdfViewer.tsx
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

  const isIOS = React.useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    // iPhone/iPad/iPod or iPadOS Safari (MacIntel + touch)
    return /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && (navigator).maxTouchPoints > 1);
  }, []);

  const withBase = React.useCallback((path: string) => {
    return new URL(path.replace(/^\//, ''), typeof document !== 'undefined' ? document.baseURI : '/').toString();
  }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mod = await import('react-pdf');

        // Set worker URL (prefer modern .mjs; fall back to legacy .js if you copied both)
        const pdfjsLib = mod.pdfjs as unknown as typeof import('pdfjs-dist');
        const workerCandidates = ['pdf.worker.min.mjs', 'pdf.worker.min.js'];
        // If you only copied the .mjs, this will pick it.
        const workerSrc = withBase(workerCandidates[0]);

        if (typeof Worker !== 'function') {
          setFallback(true);
          return;
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

        if (alive) setRPDF(mod);
      } catch {
        if (alive) setFallback(true);
      }
    })();
    return () => { alive = false; };
  }, [withBase]);

  React.useEffect(() => {
    let raf = 0;
    let tries = 0;
    const measure = () => {
      const el = ref.current;
      const w = el?.getBoundingClientRect().width ?? 0;
      if (w > 10 || tries > 60) {
        setWidth(Math.min(900, Math.max(1, Math.round(w || (typeof window !== 'undefined' ? window.innerWidth : 390)))));
      } else {
        tries++; raf = requestAnimationFrame(measure);
      }
    };
    measure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      if (ref.current) ro.observe(ref.current);
    } else {
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
    return (
      <div
        ref={ref}
        style={{ width: '100%', maxWidth: 900, margin: '0 auto', minHeight: '80vh', overflowX: 'hidden' }}
      >
        <iframe
          src={withBase(fileUrl)}
          title="PDF"
          style={{ position: 'relative', width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      </div>
    );
  }

  if (!RPDF) return <div ref={ref} style={{ height: '60vh' }} />;

  const { Document, Page } = RPDF;

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        overflowX: 'hidden',
        // helps Safari not report 0 width inside flex/grid during first paint
        minWidth: 1
      }}
    >
      <Document
        file={withBase(fileUrl)}
        onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
        onLoadError={() => setFallback(true)}
        loading={<div style={{ height: '60vh' }} />}
        key={width}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={`${i}-${width}`}
            pageNumber={i + 1}
            width={width}
            // iOS = SVG to lower memory footprint, others = canvas
            renderMode={isIOS ? 'canvas' : 'canvas'}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfViewerInner), { ssr: false });
