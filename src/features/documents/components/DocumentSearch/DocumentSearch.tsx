import styles from "./DocumentSearch.module.css"
interface DocumentSearchProps {

    value: string;

    onChange: (value: string) => void;

}

const DocumentSearch = ({ value, onChange }: DocumentSearchProps) => {
    return (
        <input
            value={value}
            placeholder="Search documents..."
            onChange={e => onChange(e.target.value)}
            className={styles.search}
        />
    )
}

export default DocumentSearch