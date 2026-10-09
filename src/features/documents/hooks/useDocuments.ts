import {
    useCallback,
    useEffect,
    useMemo,
} from "react";

import {
    deleteAllDocuments,
    deleteDocument,
    getDocumentJobStatus,
    getDocuments,
    uploadDocuments,
} from "../services/documents.service";

import { useDocumentStore } from "../store/document.store";
import { useToast } from "@/shared/components/hooks/useToast";
import { useTranslation } from "@/features/localization/useTranslation";
const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 400; // ~10 minutes

const wait = (ms: number) =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });

export function useDocuments() {
    const { showToast } = useToast();
    const { t } = useTranslation();
    const documents = useDocumentStore(
        (state) => state.documents,
    );

    const processingDocuments = useDocumentStore(
        (state) => state.processingDocuments,
    );

    const search = useDocumentStore(
        (state) => state.search,
    );

    const setDocuments = useDocumentStore(
        (state) => state.setDocuments,
    );

    const setSearch = useDocumentStore(
        (state) => state.setSearch,
    );

    const addProcessingDocument = useDocumentStore(
        (state) => state.addProcessingDocument,
    );

    const updateProcessingDocument = useDocumentStore(
        (state) => state.updateProcessingDocument,
    );

    const removeProcessingDocument = useDocumentStore(
        (state) => state.removeProcessingDocument,
    );

    const loadDocuments = useCallback(async () => {
        const docs = await getDocuments();
        setDocuments(docs);
    }, [setDocuments]);

    useEffect(() => {
        loadDocuments().catch((error) => {
            console.error(
                "Failed to load documents:",
                error,
            );
        });
    }, [loadDocuments]);

    const filteredDocuments = useMemo(() => {
        if (!search.trim()) {
            return documents;
        }

        const query = search.toLowerCase();

        return documents.filter((document) =>
            document.filename
                .toLowerCase()
                .includes(query),
        );
    }, [documents, search]);

    const waitForJob = useCallback(
        async (jobId: string) => {
            for (
                let attempt = 0;
                attempt < MAX_POLL_ATTEMPTS;
                attempt += 1
            ) {
                const result =
                    await getDocumentJobStatus(jobId);

                const status =
                    result.status?.toLowerCase();

                if (
                    status === "processing" ||
                    status === "pending"
                ) {
                    await wait(POLL_INTERVAL_MS);
                    continue;
                }

                if (
                    status === "failed" ||
                    status === "error" ||
                    status === "not_found"
                ) {
                    throw new Error(
                        result.error ??
                        `Document job failed with status "${result.status}"`,
                    );
                }

                // Celery SUCCESS responses are returned
                // with the task result merged into the response.
                return result;
            }

            throw new Error(
                "Document processing timed out.",
            );
        },
        [],
    );

    const processDocument = useCallback(
        async (file: File, processingId: string) => {
            try {
                updateProcessingDocument(processingId, {
                    status: "uploading",
                    progress: 0,
                });

                const response =
                    await uploadDocuments(
                        [file],
                        (progressEvent) => {
                            if (!progressEvent.total) {
                                return;
                            }

                            updateProcessingDocument(
                                processingId,
                                {
                                    progress: Math.min(
                                        99,
                                        Math.round(
                                            (progressEvent.loaded /
                                                progressEvent.total) *
                                            100,
                                        ),
                                    ),
                                },
                            );
                        },
                    );

                const uploaded =
                    response.processed_files?.[0];

                if (!uploaded?.job_id) {
                    throw new Error(
                        "Backend did not return a job ID.",
                    );
                }

                updateProcessingDocument(processingId, {
                    status: "processing",
                    progress: undefined,
                });

                await waitForJob(
                    uploaded.job_id,
                );

                await loadDocuments();

                showToast(
                    t("notifications.documentUploaded", {
                        filename: file.name,
                    }),
                    {
                        type: "success",
                    },
                );
            } catch (error) {
                console.error(
                    "Failed to upload document:",
                    error,
                );

                showToast(
                    t("notifications.documentUploadFailed", {
                        filename: file.name,
                    }),
                    {
                        type: "error",
                    },
                );
            } finally {
                removeProcessingDocument(
                    processingId,
                );
            }
        },
        [
            loadDocuments,
            removeProcessingDocument,
            showToast,
            t,
            updateProcessingDocument,
            waitForJob,
        ],
    );

    const uploadDocumentsInQueue = useCallback(
        async (files: File[]) => {
            const queuedDocuments = files.map((file) => ({
                file,
                document: {
                    id: crypto.randomUUID(),
                    filename: file.name,
                    chunkCount: 0,
                    uploadedAt: new Date(),
                    fileType: "pdf" as const,
                    status: "queued" as const,
                },
            }));

            queuedDocuments.forEach(({ document }) => {
                addProcessingDocument(document);
            });

            for (const { file, document } of queuedDocuments) {
                await processDocument(file, document.id);
            }
        },
        [addProcessingDocument, processDocument],
    );

    const uploadDocument = useCallback(
        (file: File) => uploadDocumentsInQueue([file]),
        [uploadDocumentsInQueue],
    );

    const removeDocument = useCallback(
        async (documentId: string) => {
            const document = documents.find(
                (item) => item.id === documentId,
            );

            try {
                await deleteDocument(documentId);
                await loadDocuments();

                showToast(
                    t("notifications.documentDeleted", {
                        filename: document?.filename ?? "Document",
                    }),
                    {
                        type: "success",
                    },
                );
            } catch (error) {
                console.error(
                    "Failed to delete document:",
                    error,
                );

                showToast(
                    t("notifications.documentDeleteFailed", {
                        filename: document?.filename ?? "Document",
                    }),
                    {
                        type: "error",
                    },
                );

                throw error;
            }
        },
        [documents, loadDocuments, showToast, t],
    );

    const clearDocuments = useCallback(
        async () => {
            const documentCount = documents.length;

            try {
                await deleteAllDocuments();
                await loadDocuments();

                showToast(
                    t("notifications.documentsDeleted", {
                        count: documentCount,
                    }),
                    {
                        type: "success",
                    },
                );
            } catch (error) {
                console.error(
                    "Failed to delete all documents:",
                    error,
                );

                showToast(
                    t("notifications.documentsDeleteFailed"),
                    {
                        type: "error",
                    },
                );

                throw error;
            }
        },
        [documents.length, loadDocuments, showToast, t],
    );

    return {
        documents,
        processingDocuments,
        filteredDocuments,
        search,
        setSearch,
        uploadDocument,
        uploadDocumentsInQueue,
        removeDocument,
        clearDocuments,
    };
}
