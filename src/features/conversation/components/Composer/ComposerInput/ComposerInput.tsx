import SendButton from "@/features/conversation/components/Composer/ComposerToolbar/SendButton";
import StopButton from "@/features/conversation/components/Composer/ComposerToolbar/StopButton";
import VoiceButton from "@/features/conversation/components/Composer/ComposerToolbar/VoiceButton";
import styles from "./ComposerInput.module.css";
import { useRef } from "react";
import { useTranslation } from "@/features/localization/useTranslation";
interface ComposerInputProps {
    value: string;
    disabled?: boolean;
    waitingForResponse?: boolean;
    isRecording?: boolean;
    onChange(value: string): void;
    onSend(): void;
    onStop(): void;
    onVoice(): void;
    showStop?: boolean;
}

const ComposerInput = ({
    value,
    isRecording,
    showStop,
    waitingForResponse,
    onChange,
    onSend,
    onStop,
    onVoice,
    disabled,
}: ComposerInputProps) => {

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useTranslation();
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

    return (
        <div className={styles["composer"]}>

            <div className={styles["composer-input-row"]}>
                <textarea
                    className={`${styles["composer-textarea"]} ${waitingForResponse
                        ? styles["waiting-placeholder"]
                        : ""
                        }`}
                    id="composerInput"
                    rows={1}
                    placeholder={
                        waitingForResponse
                            ? t("chat.waitingForResponse")
                            : t("chat.inputPlaceholder")
                    }
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    ref={inputRef}
                ></textarea>

                <VoiceButton onVoice={onVoice}
                    disabled={voiceDisabled}
                    isRecording={isRecording} />
                {showStop ? (
                    <StopButton onStop={onStop} />
                ) : (
                    <SendButton
                        onSend={onSend}
                        disabled={disabled}
                    />
                )}
            </div>
        </div>
    )
}

export default ComposerInput