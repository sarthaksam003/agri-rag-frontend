import styles from "./PdfToolbar.module.css";

interface PdfToolbarProps {

    scale: number;

    onZoomIn: () => void;

    onZoomOut: () => void;

    onDownload: () => void;

}

const PdfToolbar = ({
    scale,
    onZoomIn,
    onZoomOut,
    onDownload,
}: PdfToolbarProps) => {

    return (

        <div className={styles.toolbar}>

            <div className={styles.group}>

                <button
                    type="button"
                    onClick={onDownload}
                >
                    Download
                </button>

            </div>

            <div className={styles.group}>

                <button
                    type="button"
                    onClick={onZoomOut}
                    disabled={scale <= 0.6}
                    aria-label="Zoom out"
                >
                    −
                </button>

                <span className={styles.zoom}>
                    {Math.round(scale * 100)}%
                </span>

                <button
                    type="button"
                    onClick={onZoomIn}
                    disabled={scale >= 3}
                    aria-label="Zoom in"
                >
                    +
                </button>

            </div>

        </div>

    );

};

export default PdfToolbar;