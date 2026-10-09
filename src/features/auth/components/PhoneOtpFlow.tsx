import { useState } from "react";
import { useTranslation } from "@/features/localization/useTranslation";

type PhoneOtpFlowProps = {
    mode?: "signin" | "signup";
    onVerified?: () => void;
};

type FlowStep = "phone" | "otp" | "success";

const MOCK_OTP = "123456";

export function PhoneOtpFlow({
    mode = "signin",
    onVerified,
}: PhoneOtpFlowProps) {
    const { t } = useTranslation();

    const [step, setStep] = useState<FlowStep>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const phoneRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

    const handleSendOtp = () => {
        setError("");
        setResendMessage("");

        const normalizedPhone = phone.trim();

        if (!phoneRegex.test(normalizedPhone)) {
            setError(t("login.validation.phoneInvalid"));
            return;
        }

        setIsSending(true);

        // Development-only mock OTP flow.
        // No SMS or backend request is made.
        window.setTimeout(() => {
            setIsSending(false);
            setStep("otp");
        }, 500);
    };

    const handleVerifyOtp = () => {
        setError("");
        setResendMessage("");

        if (!otp.trim()) {
            setError(t("login.otpRequired"));
            return;
        }

        setIsVerifying(true);

        // Development-only mock verification.
        window.setTimeout(() => {
            setIsVerifying(false);

            if (otp.trim() !== MOCK_OTP) {
                setError(t("login.invalidOtp"));
                return;
            }

            setStep("success");
            onVerified?.();
        }, 500);
    };

    const handleResendOtp = () => {
        setError("");
        setOtp("");
        setResendMessage(t("login.otpResent"));
    };

    const handleChangePhone = () => {
        setStep("phone");
        setOtp("");
        setError("");
        setResendMessage("");
    };

    if (step === "success") {
        return (
            <div className="mt-6">
                <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                        ✓
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                        {t("login.phoneVerified")}
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        {mode === "signin"
                            ? t("login.phoneSignInSuccess")
                            : t("login.phoneSignUpSuccess")}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleChangePhone}
                    className="mt-4 w-full cursor-pointer text-sm font-medium text-[#10162B] hover:underline"
                >
                    {t("login.useDifferentPhone")}
                </button>
            </div>
        );
    }

    if (step === "otp") {
        return (
            <div className="mt-6">
                <div className="mb-5 text-center">
                    <h2 className="text-lg font-semibold text-[#10162B]">
                        {t("login.verifyPhone")}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {t("login.otpSentTo")}{" "}
                        <span className="font-medium text-gray-700">
                            {phone}
                        </span>
                    </p>
                </div>

                <label
                    htmlFor="phone-otp"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    {t("login.otp")}
                </label>

                <input
                    id="phone-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => {
                        const value = event.target.value.replace(/\D/g, "");
                        setOtp(value);
                        setError("");
                    }}
                    placeholder={t("login.otpPlaceholder")}
                    className={`w-full rounded-2xl border px-4 py-3 text-center text-lg tracking-[0.35em] outline-none transition ${error
                            ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200"
                            : "border-gray-300 bg-white focus:border-[#10162B] focus:ring-2 focus:ring-[#10162B]/10"
                        }`}
                />

                {error && (
                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {resendMessage && (
                    <p className="mt-2 text-center text-sm text-green-600">
                        {resendMessage}
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="mt-5 w-full cursor-pointer rounded-2xl bg-[#10162B] px-6 py-3 font-medium text-white transition hover:bg-[#1A2340] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isVerifying
                        ? t("login.verifyingOtp")
                        : mode === "signin"
                            ? t("login.verifyAndSignIn")
                            : t("login.verifyAndCreateAccount")}
                </button>

                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        className="cursor-pointer font-medium text-[#10162B] hover:underline"
                    >
                        {t("login.resendOtp")}
                    </button>

                    <span className="text-gray-300">|</span>

                    <button
                        type="button"
                        onClick={handleChangePhone}
                        className="cursor-pointer text-gray-500 hover:text-[#10162B] hover:underline"
                    >
                        {t("login.changePhone")}
                    </button>
                </div>

                {/* <p className="mt-5 text-center text-xs text-gray-400">
                    {t("login.mockOtpHint")}
                </p> */}
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="relative my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-4 text-xs font-medium uppercase tracking-wider text-gray-400">
                    {t("login.or")}
                </span>
                <div className="flex-grow border-t border-gray-200" />
            </div>

            <label
                htmlFor="phone-number"
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                {t("login.phone")}
            </label>

            <input
                id="phone-number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => {
                    setPhone(event.target.value);
                    setError("");
                }}
                placeholder={t("login.phonePlaceholder")}
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${error
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 bg-white focus:border-[#10162B] focus:ring-2 focus:ring-[#10162B]/10"
                    }`}
            />

            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}

            <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending}
                className="mt-4 w-full cursor-pointer rounded-2xl bg-[#10162B] px-6 py-3 font-medium text-white transition hover:bg-[#1A2340] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSending
                    ? t("login.sendingOtp")
                    : t("login.sendOtp")}
            </button>
        </div>
    );
}