import styles from "./ComposerToolbar.module.css"
// import { useSettingsStore } from "@/features/settings/store/settings.store";
// import { useTranslation } from "@/features/localization/useTranslation";
interface ComposerToolbarProps {

  disabled: boolean;
  onAttach(): void;

  onVoice(): void;

  onSend(): void;
}

const ComposerToolbar = (_props: ComposerToolbarProps) => {
  // const { ragMode, maxQueries } = useSettingsStore();
  // const { t } = useTranslation();
  // const modeLabel =
  //   ragMode === "multiquery"
  //     ? t("chat.multiQueryRagMode", {
  //       count: maxQueries,
  //     })
  //     : t("chat.simpleRagMode");
  return (
    <div className={styles["composer-toolbar"]}>
      <div className={styles["toolbar-left"]}>
        {/* <AttachButton onAttach={onAttach} /> */}
      </div>
      <div className={styles["composer-hint"]} id="composerHint">
        {/* {t("chat.composerHint", {
          mode: modeLabel,
        })} */}
      </div>
    </div>
  )
}

export default ComposerToolbar