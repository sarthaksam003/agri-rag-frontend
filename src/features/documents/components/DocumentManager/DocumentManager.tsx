import { useState } from "react";
import { useTranslation } from "@/features/localization/useTranslation";
import DocumentList from "@/features/documents/components/DocumentList/DocumentList";
import { useDocuments } from "../../hooks/useDocuments";
import styles from "./DocumentManager.module.css";
import DocumentSearch from "@/features/documents/components/DocumentSearch/DocumentSearch";
import DeleteAllButton from "@/features/documents/components/DeleteAllButton/DeleteAllButton";
import UploadQueue from "@/features/documents/components/UploadQueue/UploadQueue";
import UploadZone from "@/features/documents/components/UploadZone/UploadZone";
import ConfirmationModal from "@/shared/components/ConfirmationModal/ConfirmationModal";

import type { DocumentFile } from "@/features/documents/types/document";

type DeleteTarget =
    | {
        type: "document";
        document: DocumentFile;
    }
    | {
        type: "all";
    }
    | null;

const DocumentManager = () => {
    const {
        documents,
        filteredDocuments,
        processingDocuments,
        search,
        setSearch,
        removeDocument,
        clearDocuments,
    } = useDocuments();
    const { t } = useTranslation();
    const [deleteTarget, setDeleteTarget] =
        useState<DeleteTarget>(null);

    const handleRequestDelete = (
        document: DocumentFile
    ) => {
        setDeleteTarget({
            type: "document",
            document,
        });
    };

    const handleRequestDeleteAll = () => {
        if (documents.length === 0) {
            return;
        }

        setDeleteTarget({
            type: "all",
        });
    };

    const handleCancelDelete = () => {
        setDeleteTarget(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        try {
            if (deleteTarget.type === "document") {
                await removeDocument(
                    deleteTarget.document.id,
                );
            } else {
                await clearDocuments();
            }

            setDeleteTarget(null);
        } catch (error) {
            console.error(
                "Failed to delete document:",
                error,
            );
        }
    };
    
    const isDeleteAll =
        deleteTarget?.type === "all";

    return (
        <div className={styles.container}>
            <UploadZone />

            <UploadQueue
                documents={processingDocuments}
            />

            <div className={styles.header}>
                <h2>
                    {t("documents.ingestedDocuments")} (
                    {filteredDocuments.length}
                    )
                </h2>

                <DeleteAllButton
                    onClick={handleRequestDeleteAll}
                    disabled={documents.length === 0}
                />
            </div>

            <DocumentSearch
                value={search}
                onChange={setSearch}
            />

            <DocumentList
                fileList={filteredDocuments}
                onDelete={handleRequestDelete}
            />

            <ConfirmationModal
                open={deleteTarget !== null}
                title={
                    isDeleteAll
                        ? t("documents.deleteAllDocumentsTitle")
                        : t("documents.deleteDocumentTitle")
                }
                message={
                    isDeleteAll
                        ? t("documents.deleteAllDocumentsMessage", {
                            count: documents.length,
                        })
                        : t("documents.deleteDocumentMessage", {
                            filename: deleteTarget?.document.filename ?? "",
                        })
                }
                confirmLabel={
                    isDeleteAll
                        ? t("actions.deleteAll")
                        : t("actions.delete")
                }
                cancelLabel={t("actions.cancel")}
                destructive
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default DocumentManager;