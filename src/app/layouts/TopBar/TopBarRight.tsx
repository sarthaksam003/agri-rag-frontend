import { LanguageSelector } from "@/app/layouts/TopBar/LanguageSelector";
import styles from "./TopBarRight.module.css";
import { IoAccessibility } from "react-icons/io5";
import { useTranslation } from "@/features/localization/useTranslation";

export const TopBarRight = () => {
  const { t } = useTranslation();
  const handleAccessibilityClick = () => {
    console.log("[Accessibility] TopBar button clicked");

    const ux4gTrigger = document.getElementById(
      "uw-widget-custom-trigger",
    );

    console.log("[Accessibility] UX4G trigger:", ux4gTrigger);

    if (ux4gTrigger) {
      setTimeout(() => {
        ux4gTrigger.click();
      }, 0);
    }
  };

  return (
    <div className={styles["topbarRight"]}>
      <LanguageSelector />

      <button
        type="button"
        className={styles["accessibilityButton"]}
        aria-label="Accessibility options"
        onClick={handleAccessibilityClick}
        title={t("common.accessibilityOptions")}
      >
        <IoAccessibility />
      </button>
    </div>
  );
};