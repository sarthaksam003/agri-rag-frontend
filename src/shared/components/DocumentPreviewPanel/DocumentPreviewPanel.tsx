import { useEffect } from "react";
import styles from "./DocumentPreviewPanel.module.css";
import DocumentPreviewPanelHeader from "@/shared/components/DocumentPreviewPanel/DocumentPreviewPanelHeader";

interface DocumentPreviewPanelProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const DocumentPreviewPanel = ({
  open,
  title,
  onClose,
  children,
}: DocumentPreviewPanelProps) => {

  useEffect(() => {

    if (!open)
      return;

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };

  }, [open]);

  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {

      if (event.key === "Escape")
        onClose();

    };

    if (open)
      window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);

  }, [open, onClose]);

  if (!open)
    return null;

  return (

    <>

      <div
        className={styles.backdrop}
        onClick={onClose}
      />

      <aside
        className={styles.panel}
      >

        <DocumentPreviewPanelHeader
          title={title}
          onClose={onClose}
        />

        <div className={styles.content}>

          {children}

        </div>

      </aside>

    </>

  );

};

export default DocumentPreviewPanel;