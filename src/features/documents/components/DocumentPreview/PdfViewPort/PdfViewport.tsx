import { useState } from "react";

import PdfToolbar from "./PdfToolbar";
import PdfViewer from "./PdfViewer";

import styles from "./PdfViewport.module.css";

interface PdfViewportProps {
    fileUrl: string;
}

const PdfViewport = ({
    fileUrl,
}: PdfViewportProps) => {

    const [scale, setScale] =
        useState(1);

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

    return (

        <div className={styles.viewport}>

            <PdfViewer
                fileUrl={fileUrl}
                scale={scale}
            />

            <PdfToolbar

                scale={scale}

                onZoomIn={handleZoomIn}

                onZoomOut={handleZoomOut}

                onDownload={() => {

                    const link =
                        document.createElement(
                            "a"
                        );

                    link.href = fileUrl;

                    link.download = "document.pdf";

                    link.click();

                }}

            />

        </div>

    );

};

export default PdfViewport;