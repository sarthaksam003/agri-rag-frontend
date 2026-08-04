import { create } from "zustand";

interface DocumentStore {
    // Documents
    documents: any[];
    documentsLoading: boolean,
    setDocuments: (documents: any[]) => void;

    setDocumentsLoading: (
        loading: boolean
    ) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({

    documents: [],
    documentsLoading: false,
    setDocuments: (documents: any[]) => set({ documents }),
    setDocumentsLoading: (loading: boolean) => set({ documentsLoading: loading }),
})
);