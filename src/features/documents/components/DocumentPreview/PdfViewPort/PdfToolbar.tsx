import styles from "./PdfToolbar.module.css";
import { useTranslation } from "@/features/localization/useTranslation";
import { FaChevronUp, FaChevronDown, FaMinus, FaPlus } from "react-icons/fa";

interface PdfToolbarProps {

    scale: number;

    onZoomIn: () => void;

    onZoomOut: () => void;


    searchQuery: string;
    searchMatchCount: number;
    searchMatchIndex: number;
    onSearchChange: (query: string) => void;
    onPreviousMatch: () => void;
    onNextMatch: () => void;

}

const PdfToolbar = ({
    scale,
    onZoomIn,
    onZoomOut,
    searchQuery,
    searchMatchCount,
    searchMatchIndex,
    // onSearchChange,
    onPreviousMatch,
    onNextMatch
}: PdfToolbarProps) => {
    const { t } = useTranslation();
    return (

        <div className={styles.toolbar}>

            <div className={styles.searchGroup}>
                {/* <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    placeholder={t("documents.searchPdfPlaceholder")}
                    aria-label={t("documents.searchPdf")}
                    className={styles.searchInput}
                /> */}

                {searchQuery.trim() && (
                    <>
                        <span className={styles.searchCount}>
                            {searchMatchCount > 0
                                ? `${searchMatchIndex + 1}/${searchMatchCount}`
                                : t("documents.noMatches")}
                        </span>

                        <button
                            type="button"
                            onClick={onPreviousMatch}
                            disabled={searchMatchCount === 0}
                            aria-label={t("documents.previousMatch")}
                            className="cursor-pointer"
                        >
                            <FaChevronUp />
                        </button>

                        <button
                            type="button"
                            onClick={onNextMatch}
                            disabled={searchMatchCount === 0}
                            aria-label={t("documents.nextMatch")}
                            className="cursor-pointer"
                        >
                            <FaChevronDown />
                        </button>
                    </>
                )}
            </div>
            <div className={styles.group}>

                <button
                    type="button"
                    onClick={onZoomOut}
                    disabled={scale <= 0.6}
                    aria-label={t("documents.zoomOut")}
                >
                    <FaMinus />
                </button>

                <span className={styles.zoom}>
                    {Math.round(scale * 100)}%
                </span>

                <button
                    type="button"
                    onClick={onZoomIn}
                    disabled={scale >= 3}
                    aria-label={t("documents.zoomIn")}
                >
                    <FaPlus />
                </button>

            </div>

        </div>

    );

};

export default PdfToolbar;