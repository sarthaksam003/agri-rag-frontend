import styles from "./DocumentSearch.module.css"
import { useTranslation } from "@/features/localization/useTranslation";
interface DocumentSearchProps {

    value: string;

    onChange: (value: string) => void;

}

const DocumentSearch = ({ value, onChange }: DocumentSearchProps) => {
    const { t } = useTranslation();
    return (
        <input
            value={value}
            placeholder={t("documents.searchPlaceholder")}
            onChange={e => onChange(e.target.value)}
            className={styles.search}
        />
    )
}

export default DocumentSearch