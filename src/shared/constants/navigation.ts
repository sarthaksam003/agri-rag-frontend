import {
    HiOutlineChatBubbleLeftRight,
    HiOutlineDocumentText,
    HiOutlineClock,
    HiOutlineCog6Tooth,
} from "react-icons/hi2";
import type { TranslationKey } from "@/features/localization/useTranslation";
interface NavigationItem {
    to: string;
    labelKey: TranslationKey;
    icon: typeof HiOutlineChatBubbleLeftRight;
    title: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        to: "/chat",
        labelKey: "navigation.chat",
        icon: HiOutlineChatBubbleLeftRight,
        title: "Chat"
    },
    {
        to: "/documents",
        labelKey: "navigation.documents",
        icon: HiOutlineDocumentText,
        title: "Documents"
    },
    {
        to: "/sessions",
        labelKey: "navigation.sessions",
        icon: HiOutlineClock,
        title: "Sessions"
    },
    {
        to: "/settings",
        labelKey: "navigation.settings",
        icon: HiOutlineCog6Tooth,
        title: "Settings"
    },
];