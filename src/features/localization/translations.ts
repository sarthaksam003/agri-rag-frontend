import type { SupportedLanguage } from "@/features/settings/constants/languages";
import { en } from "./locales/en";
import { hi } from "./locales/hi";
import { kn } from "./locales/kn";
import { ta } from "./locales/ta";
import { te } from "./locales/te";

type TranslationShape<T> = {
    [K in keyof T]:
        T[K] extends string
            ? string
            : T[K] extends Record<string, unknown>
              ? TranslationShape<T[K]>
              : never;
};

export const translations = {
    en,
    hi,
    kn,
    ta,
    te,
} satisfies Record<
    SupportedLanguage,
    TranslationShape<typeof en>
>;