import { useEffect, useState } from "react";

import PdfToolbar from "./PdfToolbar";
import PdfViewer from "./PdfViewer";

import styles from "./PdfViewport.module.css";

interface PdfViewportProps {
    fileUrl: string;
    initialPage?: number;
}

const PdfViewport = ({
    fileUrl, initialPage
}: PdfViewportProps) => {

    const [scale, setScale] =
        useState(1);
    const [searchInput, setSearchInput] = useState("");
    // const [searchQuery, setSearchQuery] = useState("");
    const [searchPages, setSearchPages] = useState<number[]>([]);
    const [searchIndex, setSearchIndex] = useState(0);

    const handleSearchChange = (query: string) => {
        setSearchInput(query);
        setSearchPages([]);
        setSearchIndex(0);
    };

    const handlePreviousMatch = () => {
        setSearchIndex((current) =>
            searchPages.length === 0
                ? 0
                : (current - 1 + searchPages.length) %
                searchPages.length
        );
    };

    const handleNextMatch = () => {
        setSearchIndex((current) =>
            searchPages.length === 0
                ? 0
                : (current + 1) % searchPages.length
        );
    };
    const handleZoomIn = () => {

        setScale(
            current =>
                Math.min(
                    current + 0.2,
                    3
                )
        );

    };

    const handleZoomOut = () => {

        setScale(
            current =>
                Math.max(
                    current - 0.2,
                    0.6
                )
        );

    };
    useEffect(() => {
        const timer = window.setTimeout(() => {
            // setSearchQuery(searchInput);
            setSearchIndex(0);
        }, 250);

        return () => {
            window.clearTimeout(timer);
        };
    }, [searchInput]);
    return (

        <div className={styles.viewport}>

            <PdfViewer
                fileUrl={fileUrl}
                initialPage={initialPage}
                scale={scale}
                // searchQuery={searchQuery}
                searchTargetPage={searchPages[searchIndex]}
                // onSearchResults={setSearchPages}
            />

            <PdfToolbar
                scale={scale}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                searchQuery={searchInput}
                searchMatchCount={searchPages.length}
                searchMatchIndex={searchIndex}
                onSearchChange={handleSearchChange}
                onPreviousMatch={handlePreviousMatch}
                onNextMatch={handleNextMatch}
            />

        </div>

    );

};

export default PdfViewport;