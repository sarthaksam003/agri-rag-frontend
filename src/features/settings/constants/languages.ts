export const SUPPORTED_LANGUAGES = [
    {
        code: "en",
        nativeName: "English",
        englishName: "English",
    },
    {
        code: "hi",
        nativeName: "हिन्दी",
        englishName: "Hindi",
    },
    {
        code: "kn",
        nativeName: "ಕನ್ನಡ",
        englishName: "Kannada",
    },
    {
        code: "ta",
        nativeName: "தமிழ்",
        englishName: "Tamil",
    },
    {
        code: "te",
        nativeName: "తెలుగు",
        englishName: "Telugu",
    },
] as const;

export type SupportedLanguage =
    (typeof SUPPORTED_LANGUAGES)[number]["code"];