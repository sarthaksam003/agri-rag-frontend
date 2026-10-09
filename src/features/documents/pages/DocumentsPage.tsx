import DocumentManager from "../components/DocumentManager/DocumentManager";
import styles from "./DocumentsPage.module.css";
import { IoDocumentOutline } from "react-icons/io5";
import { useTranslation } from "@/features/localization/useTranslation";
import DocumentPreviewPanel from "@/shared/components/DocumentPreviewPanel";
import { useDocumentPreview } from "@/features/documents/hooks/useDocumentPreview";
import DocumentPreview from "@/features/documents/components/DocumentPreview/DocumentPreview";

const DocumentsPage = () => {
  const {
    selectedDocument,
    isOpen,
    closePreview,
  } = useDocumentPreview();
  const { t } = useTranslation();

  const handleDownload = () => {
    if (!selectedDocument?.fileUrl) {
      return;
    }

    const link = document.createElement("a");

    link.href = selectedDocument.fileUrl;
    link.download =
      selectedDocument.filename || "document.pdf";

    link.click();
  };
  return (
    <section className={styles["view"]}>
      <div className={styles["page"]}>
        <div className={styles["page-inner"]}>

          <div className={styles["page-header"]}>
            <div className={styles["pageTitle"]}>
              <IoDocumentOutline />
              {t("documents.managementTitle")}
            </div>

            <div className={styles["pageSub"]}>
              {t("documents.managementDescription")}
            </div>
          </div>

          <div>

            <DocumentPreviewPanel
              open={isOpen}
              onClose={closePreview}
              title={selectedDocument?.filename}
              onDownload={handleDownload}

            >
              {selectedDocument && (
                <DocumentPreview />
              )}
            </DocumentPreviewPanel>
          </div>

          <DocumentManager />

        </div>
      </div>
    </section>
  );
};

export default DocumentsPage;