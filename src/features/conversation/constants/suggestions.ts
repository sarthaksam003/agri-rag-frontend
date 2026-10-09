import type { TranslationKey } from "@/features/localization/useTranslation";

export interface Suggestion {
    id: string;
    translationKey: TranslationKey;
}

export const SUGGESTIONS: Suggestion[] = [
    {
        id: "fertilizer",
        translationKey: "suggestions.fertilizer",
    },
    {
        id: "blight",
        translationKey: "suggestions.blight",
    },
    {
        id: "irrigation",
        translationKey: "suggestions.irrigation",
    },
    {
        id: "summary",
        translationKey: "suggestions.summary",
    },
];