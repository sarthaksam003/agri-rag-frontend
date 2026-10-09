import { useState } from "react";
import styles from "./UploadZone.module.css";
import { FiUpload } from "react-icons/fi";
import { useDocuments } from "@/features/documents/hooks/useDocuments";
import { useRef } from "react";
import { useToast } from "@/shared/components/hooks/useToast";
import { useTranslation } from "@/features/localization/useTranslation";
// interface UploadZoneProps {

// }

const UploadZone = () => {
    const { t } = useTranslation();
    const [dragOver, setDragOver] = useState(false);
    const { showToast } = useToast();
    const inputRef =
        useRef<HTMLInputElement>(null);
    const { uploadDocumentsInQueue } =
        useDocuments();

    const handleBrowse = () => {

        inputRef.current?.click();

    };

    const handleFileSelection = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const files =
            event.target.files;

        if (!files)
            return;

        const validFiles: File[] = [];

        for (const file of Array.from(files)) {
            if (file.type !== "application/pdf") {
                console.warn(
                    `${file.name} failed to upload`
                );

                showToast(
                    `"${file.name}" ${t("documents.unsupportedFileType")}`,
                    {
                        type: "error",
                    }
                );

                continue;
            }

            validFiles.push(file);

        }

        await uploadDocumentsInQueue(validFiles);

        event.target.value = "";



    };
    const handleDrop = async (
        files: File[]
    ) => {
        const validFiles: File[] = [];

        for (const file of files) {
            if (file.type !== "application/pdf") {
                console.warn(
                    `${file.name} failed to upload`
                );

                showToast(
                    `"${file.name}" ${t("documents.pdfOnly")}`,
                    {
                        type: "error",
                    }
                );

                continue;
            }

            validFiles.push(file);
        }

        await uploadDocumentsInQueue(validFiles);
    };
    return (
        <div className={`${styles["dropzone-full"]} ${dragOver ? styles.active : ""}`} onClick={handleBrowse}
            onDragEnter={(event) => {

                event.preventDefault();

                setDragOver(true);

            }}

            onDragOver={(event) => {

                event.preventDefault();

            }}

            onDragLeave={() => {

                setDragOver(false);

            }}

            onDrop={async (event) => {

                event.preventDefault();

                setDragOver(false);

                await handleDrop(
                    Array.from(
                        event.dataTransfer.files
                    )
                );

            }}>
            <input

                ref={inputRef}

                type="file"

                hidden

                accept=".pdf"

                multiple

                onChange={handleFileSelection}

            />
            <FiUpload />
            <div className={styles["dropzone-title"]}>{t("documents.dragDropTitle")}</div>
            <div className={styles["dropzone-sub"]}>{t("documents.dragDropSubtitle")}</div>
        </div>

    )
}

export default UploadZone
