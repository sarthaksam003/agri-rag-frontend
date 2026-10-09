import { useEffect, useState } from "react";

import { useTranslation } from "@/features/localization/useTranslation";
import cdacRoundLogo from "@/assets/cdacroundlogo.png";
import { pickRandomHeroImage } from "./hero-images";

interface LoadingScreenProps {
    message?: string;
}

export function LoadingScreen({ message = "Loading" }: LoadingScreenProps) {
    const [heroImage] = useState(pickRandomHeroImage);
    const [dotCount, setDotCount] = useState(1);
    const { t } = useTranslation();
    const displayMessage = message ?? t("common.loading");
    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((prev) => (prev % 3) + 1);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden">
            <style>{`
                @keyframes cdac-spin-pause {
                    0%   { transform: rotateY(0deg); }
                    15%  { transform: rotateY(0deg); }
                    75%  { transform: rotateY(360deg); }
                    100% { transform: rotateY(360deg); }
                }
                .cdac-spin {
                    animation: cdac-spin-pause 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
                    transform-style: preserve-3d;
                }
            `}</style>

            <img
                key={heroImage}
                src={heroImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#10162B]/95 via-[#10162B]/85 to-[#10162B]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* spinner + label */}
            <div
                className="relative z-10 flex flex-col items-center gap-6"
                style={{ perspective: "800px" }}
            >
                <div className="cdac-spin h-24 w-24 drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] sm:h-28 sm:w-28">
                    <img
                        src={cdacRoundLogo}
                        alt="CDAC"
                        className="h-full w-full rounded-full"
                    />
                </div>

                <p
                    className="flex items-baseline text-base font-medium tracking-wide text-white sm:text-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    {displayMessage}
                    <span className="inline-block w-6 text-left">
                        {".".repeat(dotCount)}
                    </span>
                </p>
            </div>
        </div>
    );
}