import { useDocumentStore } from "../store/document.store";

export function useDocumentPreview() {

    const selectedDocument =
        useDocumentStore(
            state => state.selectedDocument
        );

    const openPreview =
        useDocumentStore(
            state => state.openPreview
        );

    const closePreview =
        useDocumentStore(
            state => state.closePreview
        );

    return {

        selectedDocument,

        openPreview,

        closePreview,

        isOpen: selectedDocument !== null,

    };

}