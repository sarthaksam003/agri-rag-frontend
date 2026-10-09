import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authApi } from "@/features/auth/api/apiAuth";
import { HERO_IMAGE_URLS } from "./pageBg"
// Adjust this import to wherever logo.png actually lives in your assets folder
import logo from "@/assets/logo.png";
import cdacLogo from "@/assets/cdacLogo.png";
import cdacLogoWhite from "@/assets/cdacLogoWhite.png";
import meityLogo from "@/assets/MEITYLogo.svg";
import { RegistrationForm } from "@/features/auth/components/RegistrationForm";
import { useTranslation } from "@/features/localization/useTranslation";
import { PhoneOtpFlow } from "@/features/auth/components/PhoneOtpFlow";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Pool of Indian farming photos — one is picked at random each time this
// page mounts (i.e. on every refresh). Swap any of these for your own
// assets whenever you have them; keep the array non-empty.

function pickRandomHeroImage() {
    return HERO_IMAGE_URLS[
        Math.floor(Math.random() * HERO_IMAGE_URLS.length)
    ];
}

export function LoginPage() {
    const { isLoading, isAuthenticated
        // , isError 
    } = useAuth();
    const location = useLocation();
    const { t } = useTranslation();

    const [authMode, setAuthMode] = useState<"signin" | "signup">(
        "signin",
    );
    const authPanelRef = useRef<HTMLDivElement>(null);
    // Lazy initializer so this only runs once per mount (i.e. changes on
    // every page refresh) rather than on every re-render.
    const [heroImage] = useState(pickRandomHeroImage);

    useEffect(() => {
        authPanelRef.current?.scrollTo({
            top: 0,
            behavior: "auto",
        });
    }, [authMode]);

    useEffect(() => {
        document.title = "Sign in | AgriChat";
    }, []);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#10162B]">
                <div className="flex flex-col items-center gap-3">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5B65C]/25 border-t-[#E5B65C]" />
                    <p className="text-sm text-white/60">Loading...</p>
                </div>
            </main>
        );
    }

    if (isAuthenticated) {
        const from = location.state?.from || "/chat";

        return <Navigate to={from} replace />;
    }

    const handleGoogleLogin = async () => {
        try {
            const authorizationUrl = await authApi.getGoogleAuthorizationUrl();
            window.location.assign(authorizationUrl);
        } catch (error) {
            console.error("Google login failed:", error);
        }
    };

    return (
        <main className="flex h-screen w-full flex-col overflow-hidden md:flex-row">
            <style>{`
                @keyframes agrichat-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .agrichat-float { animation: agrichat-float 6s ease-in-out infinite; }
            `}</style>

            {/* LEFT: image + brand story panel */}
            <div className="relative hidden h-screen flex-shrink-0 overflow-hidden md:flex md:w-[58%] md:flex-col md:justify-between lg:w-[60%]">                <img
                key={heroImage}
                src={heroImage}
                alt="Farmer working in a field in India"
                className="absolute inset-0 h-full w-full object-cover"
            />
                {/* dark brand overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#10162B]/95 via-[#10162B]/78 to-[#10162B]/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* wordmark */}
                <div className="relative z-10 flex items-center gap-3 px-10 pt-10 lg:px-14 lg:pt-12">
                    <div className="flex items-center">

                        <img src={cdacLogo} alt="AgriChat logo" className="h-9 w-12" />
                        <img src={logo} alt="AgriChat logo" className="h-12 w-12" />
                    </div>
                    <span
                        className="text-lg font-semibold tracking-wide text-white"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        AgriChat
                    </span>
                </div>

                {/* headline */}
                <div className="relative z-10 flex flex-1 flex-col justify-center px-10 lg:px-14">
                    <div className="max-w-lg">
                        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#E5B65C]/30 bg-[#E5B65C]/10 px-3 py-1 text-xs font-medium text-[#E5B65C] backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E5B65C]" />
                            RAG-powered for Indian agriculture
                        </span>

                        <h1
                            className="text-4xl font-semibold leading-[1.15] text-white lg:text-[2.75rem]"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            India&rsquo;s AI companion
                            <br />
                            for every farmer.
                        </h1>

                        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
                            Ask about fertilizer schedules, pest control,
                            irrigation plans, and government schemes —
                            grounded in real documents, answered in your
                            language.
                        </p>

                        {/* <div className="mt-8 flex flex-wrap gap-2.5">
                            {FEATURE_CHIPS.map((chip) => (
                                <span
                                    key={chip.label}
                                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-white/85 backdrop-blur-sm"
                                >
                                    <span aria-hidden="true">
                                        {chip.icon}
                                    </span>
                                    {chip.label}
                                </span>
                            ))}
                        </div> */}
                    </div>
                </div>

                {/* floating "live query" card, echoes the in-app RAG experience */}
                {/* <div className="agrichat-float absolute right-10 top-28 z-10 hidden w-72 rounded-2xl border border-white/10 bg-[#10162B]/70 p-4 shadow-2xl backdrop-blur-md xl:block">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Live
                        </span>
                        <span className="text-[11px] text-white/40">
                            Paddy · Pest ID
                        </span>
                    </div>

                    <p className="mt-3 text-sm text-white/90">
                        &ldquo;धान की फसल में सफ़ेद मक्खी दिख रही
                        है&rdquo;
                    </p>

                    <div className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-xs text-[#E5B65C]">
                        Whitefly detected — advisory shared, follow-up
                        scheduled
                    </div>
                </div> */}

                {/* footer strip */}
                <div className="relative z-10 flex items-center gap-2 px-10 pb-10 text-xs text-white/40 lg:px-14 lg:pb-12">
                    <span className="h-1 w-1 rounded-full bg-[#E5B65C]" />
                    Built for kisan, in 22+ Indian languages
                </div>
            </div>

            {/* RIGHT: sign-in panel */}
            <div className="relative h-screen w-full flex-1 overflow-hidden bg-[#EEF1F6]">
                {/* stationary faint brand watermark */}
                <img
                    src={logo}
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -right-16 z-0 h-72 w-72 opacity-[0.05]"
                />

                <div className="absolute left-6 right-6 top-6 z-10 flex items-center justify-between md:hidden">
                    <img
                        src={cdacLogoWhite}
                        alt="CDAC logo"
                        className="h-15 w-auto"
                    />

                    <img
                        src={meityLogo}
                        alt="MeitY logo"
                        className="h-15 w-auto"
                    />
                </div>

                {/* <div
                    ref={authPanelRef}
                    className={`relative z-10 h-full overflow-x-hidden ${authMode === "signup"
                            ? "overflow-y-auto"
                            : "overflow-y-hidden"
                        }`}
                > */}
                <div
                    ref={authPanelRef}
                    className="relative z-10 h-full overflow-x-hidden overflow-y-auto"
                >
                    <div className="flex min-h-full items-center justify-center px-6 py-16">
                        <div className="relative z-10 w-full max-w-md">
                            {/* mobile-only compact header (left panel is hidden below md) */}

                            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(16,22,43,0.18)] sm:p-10">
                                <div className="mb-6 text-center">
                                    <div className="mx-auto mb-3 flex items-center justify-center">
                                        <img
                                            src={logo}
                                            alt=""
                                            className="h-24 w-24"
                                        />
                                    </div>

                                    <h1
                                        className="text-2xl font-semibold text-[#10162B]"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        {authMode === "signin"
                                            ? t("login.welcome")
                                            : t("login.createAccount")}
                                    </h1>

                                    <p className="mt-2 text-sm text-gray-500">
                                        {authMode === "signin"
                                            ? t("login.signInDescription")
                                            : t("login.signUpDescription")}
                                    </p>
                                </div>

                                {/* Sign in / Sign up tabs */}
                                <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1 ">
                                    <button
                                        type="button"
                                        onClick={() => setAuthMode("signin")}
                                        className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition ${authMode === "signin"
                                            ? "bg-white text-[#10162B] shadow-sm"
                                            : "text-gray-500 hover:text-[#10162B]"
                                            }`}
                                    >
                                        {t("login.signIn")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setAuthMode("signup")}
                                        className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition ${authMode === "signup"
                                            ? "bg-white text-[#10162B] shadow-sm"
                                            : "text-gray-500 hover:text-[#10162B]"
                                            }`}
                                    >
                                        {t("login.signUp")}
                                    </button>
                                </div>

                                {authMode === "signin" ? (
                                    <>
                                        <button
                                            onClick={handleGoogleLogin}
                                            className={`
            w-full flex items-center justify-center gap-3 px-6 py-3 
            border border-gray-300 rounded-2xl text-gray-700 font-medium
            hover:bg-gray-50 hover:shadow-md transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            cursor-pointer
          `}
                                        >
                                            {/* Google Icon */}
                                            <svg
                                                className="w-5 h-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="#4285F4"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </svg>
                                            {/* Keep your existing Google SVG here */}
                                            Continue with Google
                                        </button>
                                        <PhoneOtpFlow mode="signin" />
                                        {/* Keep your existing Terms / Privacy text here */}

                                        {/* {isError && (
                                            <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-700 ring-1 ring-amber-100">
                                                You are not currently signed in.
                                            </div>
                                        )} */}
                                    </>
                                ) : (
                                    <RegistrationForm
                                        onSwitchToSignIn={() => setAuthMode("signin")}
                                    />
                                )}
                            </div>
                            <p className="mt-6 text-center text-xs text-gray-400">
                                Available in 22+ Indian languages · Fertilizer,
                                pest, irrigation & scheme guidance
                            </p>
                        </div>                    </div>

                </div>
            </div>
        </main>
    );
}