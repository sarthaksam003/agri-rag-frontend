import { useEffect, useRef, useState } from "react";
import styles from "./LanguageSelector.module.css";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import {
    SUPPORTED_LANGUAGES,
} from "@/features/settings/constants/languages";
import { useTranslation } from "@/features/localization/useTranslation";
// import { translations } from "@/features/localization/translations";
import { useToast } from "@/shared/components/hooks/useToast";
const LANGUAGE_ICON_MAP: Record<string, string> = {
    en: "A",
    hi: "अ",
    kn: "ಕ",
    te: "త",
    ta: "த",

};

export const LanguageSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const { showToast } = useToast();
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const language = useSettingsStore(
        (state) => state.language,
    );

    const setLanguage = useSettingsStore(
        (state) => state.setLanguage,
    );

    const currentLanguage =
        SUPPORTED_LANGUAGES.find((supportedLanguage) => supportedLanguage.code === language) ??
        SUPPORTED_LANGUAGES[0];

    const currentGlyph = LANGUAGE_ICON_MAP[language] ?? currentLanguage.englishName.charAt(0).toUpperCase();

    return (
        <div className={styles["dropdown"]} title={t("common.language")} ref={ref}>
            <button
                type="button"
                className={styles["langTrigger"]}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setIsOpen((open) => !open)}
            >
                <span className={styles["langGlyph"]}>{currentGlyph}</span>
                <span className="hidden md:block">
                    {t("common.language")}
                </span>
                <span>
                    {language.toUpperCase()}
                </span>

                <svg
                    className="chev"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <div
                className={`${styles.menu} ${isOpen ? styles.open : ""
                    }`}
            >
                <div className={styles["menu-label"]}>
                    {t("common.language")}
                </div>

                {SUPPORTED_LANGUAGES.map((supportedLanguage) => (
                    <button
                        key={supportedLanguage.code}
                        className={`${styles["menu-item"]} ${language === supportedLanguage.code
                            ? styles["selected"]
                            : ""
                            }`}
                        aria-pressed={language === supportedLanguage.code}
                        onClick={() => {
                            const languageName = supportedLanguage.englishName;

                            const message = t(
                                "notifications.languageChanged",
                                {
                                    language: languageName,
                                },
                                supportedLanguage.code,
                            );

                            setLanguage(supportedLanguage.code);
                            setIsOpen(false);

                            showToast(message, {
                                type: "success",
                            });
                        }}
                    >
                        <span className={styles["menu-item-content"]}>
                            <span className={styles["menu-item-icon"]} aria-hidden="true">
                                {LANGUAGE_ICON_MAP[supportedLanguage.code] ?? supportedLanguage.englishName.charAt(0).toUpperCase()}
                            </span>
                            <span className={styles["mi-main"]}>
                                <span className={styles["native-name"]} lang={supportedLanguage.code}>
                                    {supportedLanguage.nativeName}
                                </span>
                                <span className={styles["english-name"]}>
                                    {supportedLanguage.englishName}
                                </span>
                            </span>
                        </span>
                        {language === supportedLanguage.code && (
                            <span className={styles["selected-check"]} aria-hidden="true">
                                <svg viewBox="0 0 20 20" fill="none">
                                    <path d="m4.5 10.2 3.6 3.6 7.4-7.4" />
                                </svg>
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};