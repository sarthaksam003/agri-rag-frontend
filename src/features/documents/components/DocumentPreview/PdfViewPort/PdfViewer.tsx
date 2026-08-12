import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import styles from "./PdfViewer.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  fileUrl: string;
  scale: number;
}

const PdfViewer = ({
  fileUrl,
  scale,
}: PdfViewerProps) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);


  // const handleDocumentError = (error: Error) => {
  //   console.error(
  //     "[PDF] Failed to load:",
  //     error,
  //   );
  // };

  return (
    <div className={styles.viewer} >

      <Document
        file={fileUrl}
        onLoadSuccess={(loadedPdf) => {
          console.log(
            "[PDF] Loaded successfully. Pages:",
            loadedPdf.numPages,
          );

          setPdf(loadedPdf);
        }}
        onLoadError={(error) => {
          console.error(
            "[PDF] Failed to load:",
            error,
          );
        }}
      />

      {pdf && (
        <Virtuoso
          className={styles.virtuoso}
          totalCount={pdf.numPages}
          increaseViewportBy={{
            top: 800,
            bottom: 800,
          }}
          itemContent={(index) => (
            <div className={styles.page}>
              <Page
                pdf={pdf}
                pageNumber={index + 1}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          )}
        />
      )}
    </div>
  );
};

export default PdfViewer;