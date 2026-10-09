import styles from "./SessionSearch.module.css";
import { useTranslation } from "@/features/localization/useTranslation";
interface SessionSearchProps {
    value: string;
    onChange: (value: string) => void;
}

const SessionSearch = ({
    value,
    onChange,
}: SessionSearchProps) => {
    const { t } = useTranslation();
    return (
        <input
            type="search"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={styles.search}
            placeholder={t("sessions.searchPlaceholder")}
            aria-label={t("sessions.searchAriaLabel")}
        />
    );
};

export default SessionSearch;