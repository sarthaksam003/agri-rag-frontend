import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SupportedLanguage } from "@/features/settings/constants/languages";

interface SettingsStore {

    profileName: string;
    occupation: string;
    // displayPicture: string | null;

    language: SupportedLanguage;

    setLanguage: (language: SupportedLanguage) => void;


    setProfileName: (name: string) => void;
    setOccupation: (occupation: string) => void;
    // setDisplayPicture: (picture: string | null) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({

            profileName: "Sarthak Sambharia",
            occupation: "Employee",
            // displayPicture: null,

            language: "en",

            setLanguage: (language) =>
                set({
                    language: language,
                }),


            setProfileName: (name) =>
                set({
                    profileName: name,
                }),

            setOccupation: (occupation) =>
                set({
                    occupation,
                }),

            // setDisplayPicture: (picture) =>
            //     set({
            //         displayPicture: picture,
            //     }),
        }),
        {
            name: "agrirag-settings",
        },
    ),
);