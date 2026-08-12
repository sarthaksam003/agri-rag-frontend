import SendButton from "@/features/conversation/components/Composer/ComposerToolbar/SendButton";
import VoiceButton from "@/features/conversation/components/Composer/ComposerToolbar/VoiceButton";
import styles from "./ComposerInput.module.css";
import { useEffect, useRef } from "react";

interface ComposerInputProps {

    value: string;

    onChange(value: string): void;

    onSend(): void;

    onVoice(): void;

    disabled?: boolean;

}
const ComposerInput = ({ value, onChange, onSend, onVoice, disabled }: ComposerInputProps) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const voiceDisabled = disabled || Boolean(value.trim());
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {

        if (e.key !== "Enter")
            return;

        if (e.shiftKey)
            return;

        e.preventDefault();

        onSend();

    };

    useEffect(() => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    }, [value, disabled]);


    return (
        <div className={styles["composer"]}>

            <div className={styles["composer-input-row"]}>
                <textarea className={styles["composer-textarea"]} id="composerInput" rows={1}
                    placeholder="Ask about your indexed documents…" value={value}

                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    ref={inputRef}
                ></textarea>

                <VoiceButton onVoice={onVoice}  disabled={voiceDisabled} />
                <SendButton onSend={onSend} disabled={disabled} />
            </div>
        </div>
    )
}

export default ComposerInput