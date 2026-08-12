import { useState } from "react";
import styles from "./UploadZone.module.css";
import { FiUpload } from "react-icons/fi";
import { useDocuments } from "@/features/documents/hooks/useDocuments";
import { useRef } from "react";
import { useToast } from "@/shared/components/hooks/useToast";

interface UploadZoneProps {

}

const UploadZone = () => {
    const [dragOver, setDragOver] = useState(false);
    const { showToast } = useToast();
    const inputRef =
        useRef<HTMLInputElement>(null);
    const { uploadDocument } =
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

        for (const file of Array.from(files)) {
            if (file.type !== "application/pdf") {
                console.warn(
                    `${file.name} failed to upload`
                );

                showToast(
                    `"${file.name}" could not be uploaded. Unsupported file type.`,
                    {
                        type: "error",
                    }
                );

                continue;
            }

            await uploadDocument(file);

        }

        event.target.value = "";



    };
    const handleDrop = async (
        files: File[]
    ) => {
        for (const file of files) {
            if (file.type !== "application/pdf") {
                console.warn(
                    `${file.name} failed to upload`
                );

                showToast(
                    `"${file.name}" could not be uploaded. Only PDF files are supported.`,
                    {
                        type: "error",
                    }
                );

                continue;
            }

            await uploadDocument(file);
        }
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
            <div className={styles["dropzone-title"]}>Drag & drop PDF files here</div>
            <div className={styles["dropzone-sub"]}>or click to browse · PDF files only</div>
        </div>

    )
}

export default UploadZone