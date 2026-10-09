import { useDocumentStore } from "../store/document.store";

export function useDocumentPreview() {

    const selectedDocument =
        useDocumentStore(
            state => state.selectedDocument
        );

    const selectedPage =
        useDocumentStore(
            state => state.selectedPage
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

        selectedPage,

        openPreview,

        closePreview,

        isOpen: selectedDocument !== null,

    };

}