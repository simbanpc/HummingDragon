// components/PdfViewer.tsx
'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';

function PdfViewerInner({ fileUrl }: { fileUrl: string }) {
  // Import inside the client component
  const { Document, Page, pdfjs } = require('react-pdf');

  // Worker MUST match the installed pdfjs-dist version
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const [numPages, setNumPages] = React.useState(0);
  const [width, setWidth] = React.useState(900);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const ro = new ResizeObserver(() =>
      setWidth(ref.current?.clientWidth ?? 900)
    );
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  
  const file = useMemo(
    () => ({ url: fileUrl, /* httpHeaders, withCredentials */ }),
    [fileUrl /*, httpHeaders, withCredentials */]
  );
  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
      <Document file={file} onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}>
        {Array.from({ length: numPages }, (_, i) => (
          <Page key={i} pageNumber={i + 1} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
        ))}
      </Document>
    </div>
  );
}

// Disable SSR to avoid DOMMatrix errors on the server
export default dynamic(() => Promise.resolve(PdfViewerInner), { ssr: false });
