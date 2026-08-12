import { useState } from "react";

import DocumentList from "@/features/documents/components/DocumentList/DocumentList";
import { useDocuments } from "../../hooks/useDocuments";
import styles from "./DocumentManager.module.css";
import DocumentSearch from "@/features/documents/components/DocumentSearch/DocumentSearch";
import DeleteAllButton from "@/features/documents/components/DeleteAllButton/DeleteAllButton";
import UploadQueue from "@/features/documents/components/UploadQueue/UploadQueue";
import UploadZone from "@/features/documents/components/UploadZone/UploadZone";
import ConfirmationModal from "@/shared/components/ConfirmationModal/ConfirmationModal";

import type { DocumentFile } from "@/features/documents/types/document";
import { useToast } from "@/shared/components/hooks/useToast";

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
    const { showToast } = useToast();
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

    const handleConfirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        if (deleteTarget.type === "document") {
            const filename =
                deleteTarget.document.filename;

            removeDocument(
                deleteTarget.document.id
            );

            showToast(
                `"${filename}" deleted successfully.`,
                {
                    type: "success",
                }
            );
        } else {
            const count = documents.length;

            clearDocuments();

            showToast(
                `${count} document${count === 1 ? "" : "s"
                } deleted successfully.`,
                {
                    type: "success",
                }
            );
        }

        setDeleteTarget(null);
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
                    Ingested Documents (
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
                        ? "Delete all documents?"
                        : "Delete document?"
                }
                message={
                    isDeleteAll
                        ? `Are you sure you want to delete all ${documents.length} documents? This action cannot be undone.`
                        : `Are you sure you want to delete "${deleteTarget?.document.filename}"? This action cannot be undone.`
                }
                confirmLabel={
                    isDeleteAll
                        ? "Delete all"
                        : "Delete"
                }
                cancelLabel="Cancel"
                destructive
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default DocumentManager;