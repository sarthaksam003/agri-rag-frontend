import styles from "./DocumentPreview.module.css";
import { useDocumentPreview } from "../../hooks/useDocumentPreview";
import DocumentMetadata from "./DocumentMetadata";
import PdfViewport from "@/features/documents/components/DocumentPreview/PdfViewPort/PdfViewport";

const DocumentPreview = () => {
    const { selectedDocument } = useDocumentPreview();
    if (!selectedDocument) {
        return null;
    }
    const fileUrl = selectedDocument.fileUrl;

    return (

        <div className={styles.preview}>

            <DocumentMetadata />

            <section className={styles.viewer}>

                {fileUrl ? (

                    <PdfViewport
                        fileUrl={fileUrl}
                    />

                ) : (

                    <div className={styles.placeholder}>
                        ...
                    </div>

                )}

            </section>

        </div>

    );

};

export default DocumentPreview;