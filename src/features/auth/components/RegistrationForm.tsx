import { useState } from "react";
import { useTranslation } from "@/features/localization/useTranslation";
import { PhoneOtpFlow } from "./PhoneOtpFlow";

interface RegistrationFormProps {
    onSwitchToSignIn: () => void;
}

type FormValues = {
    name: string;
    occupation: string;
    email: string;
    phone: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const namePattern = /^[\p{L}\s.'-]{2,50}$/u;
const phonePattern = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegistrationForm = ({
    onSwitchToSignIn,
}: RegistrationFormProps) => {
    const { t } = useTranslation();

    const [values, setValues] = useState<FormValues>({
        name: "",
        occupation: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<
        Partial<Record<keyof FormValues, boolean>>
    >({});
    const [showPhoneVerification, setShowPhoneVerification] =
        useState(false);

    const [registrationComplete, setRegistrationComplete] =
        useState(false);

    const validateField = (
        field: keyof FormValues,
        value: string,
    ): string | undefined => {
        const trimmedValue = value.trim();

        switch (field) {
            case "name":
                if (!trimmedValue) {
                    return t("login.validation.nameRequired");
                }

                if (!namePattern.test(trimmedValue)) {
                    return t("login.validation.nameInvalid");
                }

                return undefined;

            case "occupation":
                if (!trimmedValue) {
                    return t("login.validation.occupationRequired");
                }

                if (!namePattern.test(trimmedValue)) {
                    return t("login.validation.occupationInvalid");
                }

                return undefined;

            case "email":
                if (!trimmedValue) {
                    return undefined;
                }

                if (!emailPattern.test(trimmedValue)) {
                    return t("login.validation.emailInvalid");
                }

                return undefined;

            case "phone":
                if (!trimmedValue) {
                    return t("login.validation.phoneRequired");
                }

                if (!phonePattern.test(trimmedValue)) {
                    return t("login.validation.phoneInvalid");
                }

                return undefined;
        }
    };

    const handleChange = (
        field: keyof FormValues,
        value: string,
    ) => {
        setValues((current) => ({
            ...current,
            [field]: value,
        }));

        if (touched[field]) {
            setErrors((current) => ({
                ...current,
                [field]: validateField(field, value),
            }));
        }
    };

    const handleBlur = (field: keyof FormValues) => {
        setTouched((current) => ({
            ...current,
            [field]: true,
        }));

        setErrors((current) => ({
            ...current,
            [field]: validateField(field, values[field]),
        }));
    };

    const validateForm = (): boolean => {
        const nextErrors: FormErrors = {};

        (
            Object.keys(values) as Array<keyof FormValues>
        ).forEach((field) => {
            const error = validateField(field, values[field]);

            if (error) {
                nextErrors[field] = error;
            }
        });

        setErrors(nextErrors);

        setTouched({
            name: true,
            occupation: true,
            email: true,
            phone: true,
        });

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        setShowPhoneVerification(true);
    };


    const getInputClassName = (
        field: keyof FormValues,
    ) => {
        const hasError = touched[field] && errors[field];

        return [
            "w-full rounded-xl border px-4 py-3 text-sm outline-none transition",
            hasError
                ? "border-red-400 bg-red-50 text-red-950 placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 bg-white text-[#10162B] placeholder:text-gray-400 focus:border-[#10162B]/40 focus:ring-2 focus:ring-[#10162B]/10",
        ].join(" ");
    };

    const renderField = (
        field: keyof FormValues,
        label: string,
        placeholder: string,
        type: string = "text",
    ) => {
        const hasError = touched[field] && errors[field];

        return (
            <div>
                <label
                    htmlFor={`registration-${field}`}
                    className="mb-1.5 block text-sm font-medium text-[#10162B]"
                >
                    {label}
                </label>

                <input
                    id={`registration-${field}`}
                    name={field}
                    type={type}
                    value={values[field]}
                    onChange={(event) =>
                        handleChange(field, event.target.value)
                    }
                    onBlur={() => handleBlur(field)}
                    placeholder={placeholder}
                    className={getInputClassName(field)}
                    aria-invalid={Boolean(hasError)}
                    aria-describedby={
                        hasError
                            ? `registration-${field}-error`
                            : undefined
                    }
                />

                {hasError && (
                    <p
                        id={`registration-${field}-error`}
                        className="mt-1.5 text-xs text-red-600"
                    >
                        {errors[field]}
                    </p>
                )}
            </div>
        );
    };
    if (registrationComplete) {
        return (
            <div className="space-y-5 text-center">
                <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-6">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                        ✓
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                        {t("login.accountCreated")}
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        {t("login.accountCreatedDescription")}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="w-full cursor-pointer rounded-xl bg-[#041655] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#031b70]"
                >
                    {t("login.continueToSignIn")}
                </button>
            </div>
        );
    }

    if (showPhoneVerification) {
        return (
            <PhoneOtpFlow
                mode="signup"
                onVerified={() => setRegistrationComplete(true)}
            />
        );
    }
    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
        >
            {renderField(
                "name",
                t("login.name"),
                t("login.namePlaceholder"),
            )}

            {renderField(
                "occupation",
                t("login.occupation"),
                t("login.occupationPlaceholder"),
            )}

            {renderField(
                "email",
                t("login.emailOptional"),
                t("login.emailPlaceholder"),
                "email",
            )}

            {renderField(
                "phone",
                t("login.phone"),
                t("login.phonePlaceholder"),
                "tel",
            )}

            <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-[#041655] px-4 py-3.5 text-sm font-medium text-white transition cursor-pointer hover:bg-[#031b70] active:scale-[0.99]"
            >
                {t("login.submitSignUp")}
            </button>

            <p className="pt-2 text-center text-xs text-gray-500">
                {t("login.alreadyHaveAccount")}{" "}
                <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="font-medium text-[#041655] cursor-pointer underline underline-offset-2"
                >
                    {t("login.switchToSignIn")}
                </button>
            </p>
        </form>
    );
};