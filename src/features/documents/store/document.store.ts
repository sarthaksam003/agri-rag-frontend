import { create } from "zustand";
import type { DocumentFile } from "../types/document";

interface DocumentStore {

    documents: DocumentFile[];

    processingDocuments: DocumentFile[];

    selectedDocument: DocumentFile | null;

    selectedPage: number | null;

    search: string;

    isUploading: boolean;

    setDocuments: (documents: DocumentFile[]) => void;

    addDocument: (document: DocumentFile) => void;

    addDocuments: (documents: DocumentFile[]) => void;

    removeDocument: (id: string) => void;

    clearDocuments: () => void;

    addProcessingDocument: (
        document: DocumentFile
    ) => void;

    updateProcessingDocument: (
        id: string,
        updates: Partial<DocumentFile>
    ) => void;

    removeProcessingDocument: (
        id: string
    ) => void;

    setSearch: (search: string) => void;

    setUploading: (
        uploading: boolean
    ) => void;

    openPreview: (
        document: DocumentFile, page_number?: number
    ) => void;

    closePreview: () => void;

}

export const useDocumentStore =
    create<DocumentStore>((set) => ({

        documents: [],

        processingDocuments: [],

        selectedDocument: null,

        search: "",
        selectedPage: null,
        isUploading: false,

        setDocuments: (documents) =>
            set({
                documents,
            }),

        addDocument: (document) =>
            set((state) => ({
                documents: [
                    document,
                    ...state.documents,
                ],
            })),

        addDocuments: (documents) =>
            set((state) => ({
                documents: [
                    ...state.documents,
                    ...documents,
                ],
            })),

        removeDocument: (id) =>
            set((state) => ({
                documents: state.documents.filter(
                    document => document.id !== id
                ),

                selectedDocument:
                    state.selectedDocument?.id === id
                        ? null
                        : state.selectedDocument,
                selectedPage:
                    state.selectedDocument?.id === id
                        ? null
                        : state.selectedPage,
            })),

        clearDocuments: () =>
            set({
                documents: [],
                processingDocuments: [],
                selectedDocument: null,
                selectedPage: null,
            }),

        addProcessingDocument:
            (document) =>
                set((state) => ({

                    processingDocuments: [

                        ...state.processingDocuments,

                        document,

                    ],

                })),

        updateProcessingDocument:
            (id, updates) =>
                set((state) => ({
                    processingDocuments:
                        state.processingDocuments.map(
                            document =>
                                document.id === id
                                    ? { ...document, ...updates }
                                    : document,
                        ),
                })),

        removeProcessingDocument:
            (id) =>
                set((state) => ({

                    processingDocuments:
                        state.processingDocuments.filter(
                            document =>
                                document.id !== id
                        ),

                })),

        setSearch: (search) =>
            set({
                search,
            }),

        setUploading:
            (isUploading) =>
                set({
                    isUploading,
                }),

        openPreview:
            (document, pageNumber) =>
                set({
                    selectedDocument: document,
                    selectedPage: pageNumber ?? null,
                }),

        closePreview: () =>
            set({
                selectedDocument: null,
                selectedPage: null,
            }),

    }));
