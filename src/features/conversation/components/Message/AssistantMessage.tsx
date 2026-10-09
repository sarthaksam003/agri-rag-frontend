import type { ChatMessage } from "@/features/conversation/types/message";
import type { SourceReference } from "@/features/conversation/types/source";
import logo from "@/assets/logo.png";
import styles from "./AssistanMessage.module.css";
import { IoCopyOutline } from "react-icons/io5";
import { formatTime } from "@/features/conversation/components/Message/UserMessage";
import { synthesizeSpeech } from "@/services/apiClient";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioStore } from "@/features/voice/store/audio.store";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { useTranslation } from "@/features/localization/useTranslation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useEffect, useRef, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { FiStopCircle, FiVolume2 } from "react-icons/fi";
import rehypeRaw from "rehype-raw";
import { useToast } from "@/shared/components/hooks/useToast";


const normalizeMathDelimiters = (content: string) => {
  return content
    .replace(/\\\[([\s\S]*?)\\\]/g, "$$$1$$")
    .replace(/\\\(([\s\S]*?)\\\)/g, "$$$1$");
};

interface AssistantMessageProps {
  message: ChatMessage;
  className: string;
  onShowSources: (sources: SourceReference[]) => void;
}
const AssistantMessage = ({
  message,
  // className,
  onShowSources
}: AssistantMessageProps) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { playAudio, togglePause } = useAudioPlayer();

  const { language } = useSettingsStore();

  const { isPlayingAudio, currentAudioId } = useAudioStore();
  const [isCopied, setIsCopied] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCurrentAudio = currentAudioId === message.id;
  const isPlaying = isPlayingAudio && isCurrentAudio;

  const handleListen = async () => {
    if (isCurrentAudio) {
      togglePause();
      return;
    }

    if (isTtsLoading) {
      return;
    }

    try {
      setIsTtsLoading(true);

      showToast(t("notifications.ttsPreparing"), {
        type: "info",
      });

      const audioBlob = await synthesizeSpeech(
        message.content,
        language,
        "female",
        "demo-tenant",
      );

      await playAudio(audioBlob, message.id);
    } catch (error) {
      console.error("Failed to synthesize/play speech:", error);

      showToast(t("notifications.ttsFailed"), {
        type: "error",
      });
    } finally {
      setIsTtsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        copyTimeoutRef.current = null;
      }, 4000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const wasPlayingRef = useRef(false);

  useEffect(() => {
    if (isPlaying && !wasPlayingRef.current) {
      showToast(t("notifications.ttsPlaying"), {
        type: "success",
      });
    }

    wasPlayingRef.current = isPlaying;
  }, [isPlaying, showToast, t]);

  return (
    <div className={`${styles.msg} ${styles.assistant}`}>
      <div className={styles["msg-avatar"]}>
        <img src={logo} />
      </div>
      <div className={styles["msg-body"]}>
        <div className={styles["msg-bubble"]}>
          {message.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
            >
              {normalizeMathDelimiters(message.content)}
            </ReactMarkdown>
          ) : (
            <div className={styles["typing-indicator"]}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className={styles["citation-row"]}>
            <button
              type="button"
              className={styles["citation-tab"]}
              onClick={() => {
                if (message.sources) {
                  onShowSources(message.sources);
                }
              }}
              title={t("actions.showSources")}
            >
              <span className={styles["cnum"]}>
                {message.sources.length}
              </span>
              {t("actions.showSources")}
            </button>
            {message.content ? <div className={styles["msg-actions"]}>
              <button
                type="button"
                className={`${styles["tts-btn"]} ${isPlaying ? styles.playing : ""}`}
                onClick={handleListen}
                aria-pressed={isPlaying}
                title={
                  isTtsLoading
                    ? t("common.pleaseWait")
                    : isPlaying
                      ? t("actions.stop")
                      : t("actions.listen")
                }
                disabled={isTtsLoading}
              >
                {isPlaying ? (
                  <FiStopCircle aria-hidden="true" />
                ) : (
                  <FiVolume2 aria-hidden="true" />
                )}

                {isTtsLoading
                  ? t("common.pleaseWait")
                  : isPlaying
                    ? t("actions.stop")
                    : t("actions.listen")}
              </button>
              <button
                type="button"
                className={`${styles["copy-btn"]} ${isCopied ? styles.copied : ""}`}
                onClick={handleCopy}
                title={t("actions.copy")}
              >
                {isCopied ? <IoCheckmark /> : <IoCopyOutline />}
                {isCopied ? t("actions.copied") : t("actions.copy")}
              </button>
              <div className={styles["msg-time"]}>{formatTime(message.createdAt)}</div>
            </div> : ""}

          </div>
        )}
        {/* <div className={styles["hallucination-badge"]}>
          <span className={styles["dot"]}>
          </span>
          Possible hallucinations detected
        </div> */}

      </div>
    </div>
  );

};

export default AssistantMessage;
