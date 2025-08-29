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

  // Load react-pdf after mount; point worker to /public (same-origin)
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mod = await import('react-pdf');
        // Copy this worker to /public once (see script below)
        mod.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        if (alive) setRPDF(mod);
      } catch {
        if (alive) setFallback(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Measure container width robustly (retry until > 0), then track changes
  React.useEffect(() => {
    let raf = 0;
    let tries = 0;

    const measureNow = () => {
      const el = ref.current;
      const rectW = el?.getBoundingClientRect().width ?? 0;
      const w = rectW || (typeof window !== 'undefined' ? window.innerWidth : 390);
      // cap at 900 to match your desktop design
      setWidth(Math.min(900, Math.max(1, Math.round(w))));
    };

    const measureUntilReady = () => {
      tries++;
      const el = ref.current;
      const rectW = el?.getBoundingClientRect().width ?? 0;
      if (rectW > 10 || tries > 60) { // ~1s max
        measureNow();
      } else {
        raf = requestAnimationFrame(measureUntilReady);
      }
    };

    raf = requestAnimationFrame(measureUntilReady);

    const ro = new ResizeObserver(measureNow);
    if (ref.current) ro.observe(ref.current);

    const onResizeLike = () => measureNow();
    window.addEventListener('resize', onResizeLike);
    window.addEventListener('orientationchange', onResizeLike);
    window.addEventListener('pageshow', onResizeLike);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResizeLike);
      window.removeEventListener('orientationchange', onResizeLike);
      window.removeEventListener('pageshow', onResizeLike);
    };
  }, []);

  // Hard fallback for stubborn devices/webviews
  if (fallback) {
    return (
      <div ref={ref} style={{ width: '100%', maxWidth: 900, margin: '0 auto', minHeight: '80vh', overflowX: 'hidden' }}>
        <iframe
          src={`${fileUrl}#toolbar=1&view=fitH`}
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
      style={{ width: '100%', maxWidth: 900, margin: '0 auto', overflowX: 'hidden' }}
    >
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
        onLoadError={() => setFallback(true)}
        loading={<div style={{ height: '60vh' }} />}
        // Recreate internal layout when width jumps from 1 -> real value
        key={width}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={`${i}-${width}`}              // force page rerender on width change
            pageNumber={i + 1}
            width={width}                      // width controls size (no scale)
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfViewerInner), { ssr: false });
