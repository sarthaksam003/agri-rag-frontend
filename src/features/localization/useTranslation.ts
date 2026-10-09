import { useSettingsStore } from "@/features/settings/store/settings.store";
import { translations } from "./translations";
import type { SupportedLanguage } from "@/features/settings/constants/languages";
type TranslationTree = typeof translations.en;

type JoinKey<
    Prefix extends string,
    Key extends string,
> = `${Prefix}.${Key}`;

type NestedTranslationKey<T> = {
    [K in keyof T & string]:
    T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
    ? JoinKey<K, NestedTranslationKey<T[K]>>
    : never;
}[keyof T & string];

export type TranslationKey =
    NestedTranslationKey<TranslationTree>;

type TranslationParams = Record<string, string | number>;

export const useTranslation = () => {
    const language = useSettingsStore(
        (state) => state.language,
    );

    // const dictionary =
    //     translations[
    //     language as keyof typeof translations
    //     ] ?? translations.en;

    const getValue = (
        key: TranslationKey,
        params?: TranslationParams,
        targetLanguage?: SupportedLanguage,
    ): string => {
        const parts = key.split(".");
        const targetDictionary =
            translations[
            (targetLanguage ?? language) as keyof typeof translations
            ] ?? translations.en;

        let value: unknown = targetDictionary;

        for (const part of parts) {
            if (
                typeof value !== "object" ||
                value === null ||
                !(part in value)
            ) {
                value = undefined;
                break;
            }

            value = (value as Record<string, unknown>)[part];
        }

        if (typeof value !== "string") {
            return key;
        }

        if (!params) {
            return value;
        }

        return value.replace(
            /\{(\w+)\}/g,
            (_, parameter: string) =>
                String(
                    params[parameter] ??
                    `{${parameter}}`,
                ),
        );
    };

    return {
        t: getValue,
        language,
    };
};