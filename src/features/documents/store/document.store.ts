import { create } from "zustand";
import type { DocumentFile } from "../types/document";

interface DocumentStore {

    documents: DocumentFile[];

    processingDocuments: DocumentFile[];

    selectedDocument: DocumentFile | null;

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

    removeProcessingDocument: (
        id: string
    ) => void;

    setSearch: (search: string) => void;

    setUploading: (
        uploading: boolean
    ) => void;

    openPreview: (
        document: DocumentFile
    ) => void;

    closePreview: () => void;

}

export const useDocumentStore =
    create<DocumentStore>((set) => ({

        documents: [],

        processingDocuments: [],

        selectedDocument: null,

        search: "",

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
            })),

        clearDocuments: () =>
            set({

                documents: [],

                processingDocuments: [],

                selectedDocument: null,

            }),

        addProcessingDocument:
            (document) =>
                set((state) => ({

                    processingDocuments: [

                        ...state.processingDocuments,

                        document,

                    ],

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
            (document) =>
                set({
                    selectedDocument:
                        document,
                }),

        closePreview: () =>
            set({
                selectedDocument: null,
            }),

    }));