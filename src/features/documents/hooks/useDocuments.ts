import { useCallback, useEffect, useMemo } from "react";
import { useDocumentStore } from "../store/document.store";

import {
    getDocuments,
    mockUploadDocument,
} from "../services/documents.service";

import type { DocumentFile } from "../types/document";
import { useToast } from "@/shared/components/hooks/useToast";

export function useDocuments() {
    const { showToast } = useToast();
    const documents =
        useDocumentStore(
            state => state.documents
        );

    const processingDocuments =
        useDocumentStore(
            state => state.processingDocuments
        );

    const search =
        useDocumentStore(
            state => state.search
        );

    const setDocuments =
        useDocumentStore(
            state => state.setDocuments
        );

    const setSearch =
        useDocumentStore(
            state => state.setSearch
        );

    const addDocument =
        useDocumentStore(
            state => state.addDocument
        );
    const removeDocument =
        useDocumentStore(
            state => state.removeDocument
        );

    const clearDocuments =
        useDocumentStore(
            state => state.clearDocuments
        );
    const addProcessingDocument =
        useDocumentStore(
            state => state.addProcessingDocument
        );

    const removeProcessingDocument =
        useDocumentStore(
            state => state.removeProcessingDocument
        );

    useEffect(() => {

        async function loadDocuments() {

            const docs =
                await getDocuments();

            setDocuments(docs);

        }

        loadDocuments();

    }, [setDocuments]);

    const filteredDocuments =
        useMemo(() => {

            if (!search.trim())
                return documents;

            const query =
                search.toLowerCase();

            return documents.filter(
                document =>
                    document.filename
                        .toLowerCase()
                        .includes(query)
            );

        }, [documents, search]);

    const uploadDocument =
        useCallback(
            async (file: File) => {
                const extension =
                    file.name
                        .split(".")
                        .pop()
                        ?.toLowerCase();

                const processing: DocumentFile = {
                    id: crypto.randomUUID(),
                    filename: file.name,
                    chunkCount: 0,
                    uploadedAt: new Date(),
                    fileType:
                        extension === "pdf"
                            ? "pdf"
                            : "unknown",
                    status: "processing",
                };

                addProcessingDocument(processing);

                try {
                    const uploaded =
                        await mockUploadDocument(file);

                    removeProcessingDocument(
                        processing.id
                    );

                    addDocument(uploaded);

                    showToast(
                        `"${file.name}" uploaded successfully.`,
                        {
                            type: "success",
                        }
                    );
                } catch (error) {
                    console.error(
                        "Failed to upload document:",
                        error
                    );

                    removeProcessingDocument(
                        processing.id
                    );

                    showToast(
                        `"${file.name}" could not be uploaded. Try again later or with a different file type.`,
                        {
                            type: "error",
                        }
                    );
                }
            },
            [
                addDocument,
                addProcessingDocument,
                removeProcessingDocument,
                showToast,
            ]
        );
    return {

        documents,

        processingDocuments,

        filteredDocuments,

        search,

        setSearch,

        uploadDocument,
        removeDocument,
        clearDocuments
    };

}