import styles from "./SuggestionCard.module.css";

interface SuggestionCardProps {

    prompt: string;

    onClick?(): void;

}
const SuggestionCard = ({ prompt, onClick }: SuggestionCardProps) => {
    return (
        <button type="button" className={styles["starter-card"]} onClick={onClick}>
            <div className={styles["sc-text"]}>{prompt}</div>
        </button>
    )
}

export default SuggestionCard