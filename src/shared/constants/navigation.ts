import {
    HiOutlineChatBubbleLeftRight,
    HiOutlineDocumentText,
    HiOutlineClock,
    HiOutlineCog6Tooth,
} from "react-icons/hi2";

export const NAVIGATION_ITEMS = [
    {
        to: "/chat",
        label: "Chat",
        icon: HiOutlineChatBubbleLeftRight,
    },
    {
        to: "/documents",
        label: "Documents",
        icon: HiOutlineDocumentText,
    },
    {
        to: "/sessions",
        label: "Sessions",
        icon: HiOutlineClock,
    },
    {
        to: "/settings",
        label: "Settings",
        icon: HiOutlineCog6Tooth,
    },
];