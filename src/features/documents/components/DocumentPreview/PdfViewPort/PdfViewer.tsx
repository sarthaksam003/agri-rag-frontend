import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  Virtuoso,
  type VirtuosoHandle
} from "react-virtuoso";
import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import styles from "./PdfViewer.module.css";
import "react-pdf/dist/Page/TextLayer.css";


// const escapeHtml = (value: string) =>
//   value.replace(
//     /[&<>"']/g,
//     (character) =>
//       ({
//         "&": "&amp;",
//         "<": "&lt;",
//         ">": "&gt;",
//         '"': "&quot;",
//         "'": "&#039;",
//       })[character] ?? character,
//   );

// const escapeRegExp = (value: string) =>
//   value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// const highlightSearchText = (
//   text: string,
//   query: string,
// ) => {
//   const normalizedQuery = query
//     .trim()
//     .replace(/\s+/g, " ");

//   if (!normalizedQuery) {
//     return escapeHtml(text);
//   }

//   const pattern = normalizedQuery
//     .split(" ")
//     .map(escapeRegExp)
//     .join("\\s+");

//   const regex = new RegExp(
//     `(${pattern})`,
//     "gi",
//   );

//   let lastIndex = 0;

//   const parts: string[] = [];

//   text.replace(
//     regex,
//     (match, _capture, offset: number) => {
//       parts.push(
//         escapeHtml(
//           text.slice(lastIndex, offset),
//         ),
//       );

//       parts.push(
//         `<mark class="pdf-search-highlight">${escapeHtml(match)}</mark>`,
//       );

//       lastIndex = offset + match.length;

//       return match;
//     },
//   );

//   parts.push(
//     escapeHtml(text.slice(lastIndex)),
//   );

//   return parts.join("");
// };

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  fileUrl: string;
  scale: number;
  initialPage?: number;
  // searchQuery?: string;
  searchTargetPage?: number;
  // onSearchResults?: (pages: number[]) => void;
}

const PdfViewer = ({
  fileUrl,
  scale,
  initialPage,
  // searchQuery,
  // searchTargetPage,
  // onSearchResults
}: PdfViewerProps) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);

  const virtuosoRef =
    useRef<VirtuosoHandle>(null);
  const initialJumpRequestedRef =
    useRef(
      !initialPage ||
      initialPage <= 1
    );

  const initialJumpCorrectedRef =
    useRef(false);

  useEffect(() => {
    initialJumpRequestedRef.current =
      !initialPage ||
      initialPage <= 1;

    initialJumpCorrectedRef.current =
      false;
  }, [fileUrl, initialPage]);

  const handleItemsRendered = () => {
    if (
      initialJumpRequestedRef.current ||
      !initialPage ||
      initialPage < 1 ||
      initialPage > (pdf?.numPages ?? 0)
    ) {
      return;
    }

    if (!virtuosoRef.current) {
      return;
    }

    initialJumpRequestedRef.current = true;

    requestAnimationFrame(() => {
      virtuosoRef.current?.scrollToIndex({
        index: initialPage - 1,
        align: "start",
        behavior: "auto",
      });
    });
  };
  const handlePageRenderSuccess = (
    pageNumber: number
  ) => {
    if (
      !initialPage ||
      pageNumber !== initialPage ||
      initialJumpCorrectedRef.current
    ) {
      return;
    }

    initialJumpCorrectedRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        virtuosoRef.current?.scrollToIndex({
          index: initialPage - 1,
          align: "start",
          behavior: "auto",
        });
      });
    });
  };
  // useEffect(() => {
  //   if (
  //     !pdf ||
  //     !initialPage ||
  //     initialPage < 1 ||
  //     initialPage > pdf.numPages
  //   ) {
  //     return;
  //   }

  //   const frame = requestAnimationFrame(() => {
  //     requestAnimationFrame(() => {
  //       virtuosoRef.current?.scrollToIndex({
  //         index: initialPage - 1,
  //         align: "start",
  //         behavior: "auto",
  //       });
  //     });
  //   });

  //   return () => {
  //     cancelAnimationFrame(frame);
  //   };
  // }, [pdf, initialPage]);

  // useEffect(() => {
  //   const query = searchQuery
  //     ?.trim()
  //     .replace(/\s+/g, " ")
  //     .toLowerCase();

  //   if (!pdf || !query) {
  //     onSearchResults?.([]);
  //     return;
  //   }

  //   let cancelled = false;

  //   const searchPdf = async () => {
  //     const matchingPages: number[] = [];

  //     for (
  //       let pageNumber = 1;
  //       pageNumber <= pdf.numPages;
  //       pageNumber++
  //     ) {
  //       const page = await pdf.getPage(pageNumber);
  //       const textContent = await page.getTextContent();

  //       const pageText = textContent.items
  //         .map((item) =>
  //           "str" in item ? item.str : ""
  //         )
  //         .join(" ")
  //         .replace(/\s+/g, " ")
  //         .toLowerCase();

  //       if (pageText.includes(query)) {
  //         matchingPages.push(pageNumber);
  //       }

  //       if (cancelled) {
  //         return;
  //       }
  //     }

  //     if (!cancelled) {
  //       onSearchResults?.(matchingPages);
  //     }
  //   };

  //   searchPdf();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [pdf, searchQuery, onSearchResults]);

  // const lastSearchTargetPage =
  //   useRef<number | null>(null);

  // useEffect(() => {
  //   if (
  //     !pdf ||
  //     !searchTargetPage ||
  //     searchTargetPage < 1 ||
  //     searchTargetPage > pdf.numPages
  //   ) {
  //     return;
  //   }

  //   if (
  //     lastSearchTargetPage.current ===
  //     searchTargetPage
  //   ) {
  //     return;
  //   }

  //   lastSearchTargetPage.current =
  //     searchTargetPage;

  //   const frame = requestAnimationFrame(() => {
  //     requestAnimationFrame(() => {
  //       virtuosoRef.current?.scrollToIndex({
  //         index: searchTargetPage - 1,
  //         align: "start",
  //         behavior: "auto",
  //       });
  //     });
  //   });

  //   return () => {
  //     cancelAnimationFrame(frame);
  //   };
  // }, [pdf, searchTargetPage]);
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
          ref={virtuosoRef}
          totalCount={pdf.numPages}
          increaseViewportBy={{
            top: 800,
            bottom: 800,
          }}
          itemsRendered={handleItemsRendered}
          itemContent={(index) => (
            <div className={styles.page}>
              <Page
                pdf={pdf}
                pageNumber={index + 1}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onRenderSuccess={() =>
                  handlePageRenderSuccess(index + 1)
                }
              />
            </div>
          )}
        />
      )}
    </div>
  );
};

export default PdfViewer;