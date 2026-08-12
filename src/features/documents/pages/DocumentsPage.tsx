import DocumentManager from "../components/DocumentManager/DocumentManager";
import styles from "./DocumentsPage.module.css";
import { IoDocumentOutline } from "react-icons/io5";

import DocumentPreviewPanel from "@/shared/components/DocumentPreviewPanel";
import { useDocumentPreview } from "@/features/documents/hooks/useDocumentPreview";
import DocumentPreview from "@/features/documents/components/DocumentPreview/DocumentPreview";

const DocumentsPage = () => {
  const {
    selectedDocument,
    isOpen,
    closePreview,
  } = useDocumentPreview();

  return (
    <section className={styles["view"]}>
      <div className={styles["page"]}>
        <div className={styles["page-inner"]}>

          <div className={styles["page-header"]}>
            <div className={styles["pageTitle"]}>
              <IoDocumentOutline />
              Document Management
            </div>

            <div className={styles["pageSub"]}>
              Upload, view, and manage the knowledge base your chatbot searches.
            </div>
          </div>

          <DocumentPreviewPanel
            open={isOpen}
            onClose={closePreview}
            title={selectedDocument?.filename}
          >
            {selectedDocument && (
              <DocumentPreview />
            )}
          </DocumentPreviewPanel>

          <DocumentManager />

        </div>
      </div>
    </section>
  );
};

export default DocumentsPage;