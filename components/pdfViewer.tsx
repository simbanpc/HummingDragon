// components/PdfViewer.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
type RP = typeof import('react-pdf');

function PdfViewerInner({ fileUrl }: { fileUrl: string }) {
  // Import inside the client component

  const [RPDF, setRPDF] = React.useState<RP | null>(null);
  const [numPages, setNumPages] = React.useState(0);
  const [width, setWidth] = React.useState(900);
  const ref = React.useRef<HTMLDivElement>(null);

  // Load react-pdf ONLY in the browser after mount
  React.useEffect(() => {
    let alive = true;
    (async () => {
      const mod = await import('react-pdf');
      // Use legacy worker for Node/SSR-safe bundling
      mod.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
      if (alive) setRPDF(mod);
    })();
    return () => { alive = false; };
  }, []);

  // Responsive width
  React.useEffect(() => {
    const ro = new ResizeObserver(() => setWidth(ref.current?.clientWidth ?? 900));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  if (!RPDF) return null; // or a skeleton
  const { Document, Page } = RPDF;
  
  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
      <Document file={fileUrl} onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}>
        {Array.from({ length: numPages }, (_, i) => (
          <Page key={i} pageNumber={i + 1} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
        ))}
      </Document>
    </div>
  );
}

// Disable SSR to avoid DOMMatrix errors on the server
export default dynamic(() => Promise.resolve(PdfViewerInner), { ssr: false });
