import SuggestionCard from "@/features/conversation/components/EmptyConversation/SuggestionCard";
import styles from "./EmptyConversation.module.css";
import { SUGGESTIONS } from "@/features/conversation/constants/suggestions";
import logo from "@/assets/logo.png"

interface EmptyConversationProps {
    onSuggestionClick(text: string): void;
}

const EmptyConversation = ({ onSuggestionClick }: EmptyConversationProps) => {
    return (
        <div className={styles["empty-state"]} id="emptyState">
            <div className={styles["empty-avatar"]}>
                {/* <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> */}
                <img src={logo} className={styles.logo} />
            </div>
            <div className={styles["empty-title"]}>CaRAG Assistant</div>
            <div className={styles["empty-sub"]}>Ask questions about your ingested farming documents — fertilizer schedules, pest
                guides, irrigation plans, and more.</div>
            <div className={styles["starter-grid"]}>
                {SUGGESTIONS.map((suggestion) =>
                    <SuggestionCard key={suggestion.id} prompt={suggestion.prompt} onClick={() => onSuggestionClick?.(suggestion.prompt)} />
                )}
            </div>
        </div>
    )
}

export default EmptyConversation