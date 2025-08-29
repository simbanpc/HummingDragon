'use client';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/pdfViewer'), {
  ssr: false,
  loading: () => <div style={{ height: '60vh' }} />,
});

export default function BrochurePage() {
  return <PdfViewer fileUrl="/Humming_Dragon_Brochure_Website.pdf" />;
}
