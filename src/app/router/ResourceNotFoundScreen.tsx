import { useState } from "react";
// import { FiFile } from "react-icons/fi";
import { LuFileX2 } from "react-icons/lu";

import { useConversationStore } from "@/features/conversation/store/conversation.store";
import { useNavigate } from "react-router-dom";

import { pickRandomHeroImage } from "./hero-images";

export function ResourceNotFoundScreen() {
    const [heroImage] = useState(pickRandomHeroImage);
    const clearConversation = useConversationStore(
        state => state.clear,
    );
    const navigate = useNavigate();

    const handleNewChat = () => {
        clearConversation();
        navigate("/chat", {
            replace: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden">
            <img
                key={heroImage}
                src={heroImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-[#10162B]/95 via-[#10162B]/85 to-[#10162B]/60" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white shadow-[0_15px_25px_rgba(0,0,0,0.35)] sm:h-28 sm:w-28">
                    <LuFileX2
                        className="h-12 w-12 sm:h-14 sm:w-14"
                        aria-hidden="true"
                    />
                </div>

                <div className="text-white">
                    <p
                        className="text-5xl font-semibold tracking-tight sm:text-6xl"
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        404
                    </p>

                    <p
                        className="mt-2 text-xl font-medium sm:text-2xl"
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        Resource not found
                    </p>

                    <p
                        className="mt-2 max-w-md text-sm text-white/75 sm:text-base"
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        The resource you are looking for does not exist
                        or may have been deleted.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleNewChat}
                    className="mt-2 cursor-pointer rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[#10162B] shadow-lg transition hover:bg-white/90"
                >
                    Go to New Chat
                </button>
            </div>
        </div>
    );
}