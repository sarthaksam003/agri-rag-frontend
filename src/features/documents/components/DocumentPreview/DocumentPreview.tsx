import { useEffect, useState } from "react";

import styles from "./DocumentPreview.module.css";
import { useDocumentPreview } from "../../hooks/useDocumentPreview";
import DocumentMetadata from "./DocumentMetadata";
import PdfViewport from "@/features/documents/components/DocumentPreview/PdfViewPort/PdfViewport";
import { getDocumentFile } from "../../services/documents.service";

const DocumentPreview = () => {
    const {
        selectedDocument,
        selectedPage,
    } = useDocumentPreview();
    const [fileUrl, setFileUrl] =
        useState<string | null>(null);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!selectedDocument) {
            setFileUrl(null);
            setError(null);
            return;
        }

        let objectUrl: string | null = null;

        const loadDocument = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setFileUrl(null);

                const blob = await getDocumentFile(
                    selectedDocument.id,
                );

                objectUrl = URL.createObjectURL(blob);

                setFileUrl(objectUrl);
            } catch (err) {
                console.error(
                    "[DocumentPreview] Failed to load PDF:",
                    err,
                );

                setError(
                    "Failed to load document preview.",
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadDocument();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [selectedDocument]);

    if (!selectedDocument) {
        return null;
    }

    return (
        <div className={styles.preview}>
            <DocumentMetadata />

            <section className={styles.viewer}>
                {isLoading && (
                    <div className={styles.placeholder}>
                        Loading document...
                    </div>
                )}

                {!isLoading && error && (
                    <div className={styles.placeholder}>
                        {error}
                    </div>
                )}

                {!isLoading && !error && fileUrl && (
                    <PdfViewport
                        fileUrl={fileUrl}
                        initialPage={selectedPage ?? undefined}
                    />
                )}
            </section>
        </div>
    );
};

export default DocumentPreview;