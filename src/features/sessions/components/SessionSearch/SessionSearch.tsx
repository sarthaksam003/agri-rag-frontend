import styles from "./SessionSearch.module.css";

interface SessionSearchProps {
    value: string;
    onChange: (value: string) => void;
}

const SessionSearch = ({
    value,
    onChange,
}: SessionSearchProps) => {
    return (
        <input
            type="search"
            value={value}
            placeholder="Search sessions..."
            onChange={e => onChange(e.target.value)}
            className={styles.search}
            aria-label="Search sessions"
        />
    );
};

export default SessionSearch;