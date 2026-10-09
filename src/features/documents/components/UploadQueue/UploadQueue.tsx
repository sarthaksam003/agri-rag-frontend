import type { DocumentFile } from "@/features/documents/types/document";

import UploadItem from "../UploadItem/UploadItem";

import styles from "./UploadQueue.module.css";
import { useTranslation } from "@/features/localization/useTranslation";
interface UploadQueueProps {

    documents: DocumentFile[];

}

const UploadQueue = ({ documents }: UploadQueueProps) => {
    const { t } = useTranslation();
    const processingDocuments =

        documents.filter(

            document => document.status !== "ready"

        );

    if (processingDocuments.length === 0)

        return null;

    return (

        <section className={styles.queue}>

            <h3>{t("documents.processing")}</h3>
            <div className={styles.items}>

                {processingDocuments.map(document => (

                    <UploadItem

                        key={document.id}

                        document={document}

                    />

                ))}

            </div>

        </section>

    );

};

export default UploadQueue;