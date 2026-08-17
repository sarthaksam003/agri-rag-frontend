import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authApi } from "@/features/auth/api/apiAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function LoginPage() {
    const { isLoading, isAuthenticated, isError } = useAuth();
    const location = useLocation();

    useEffect(() => {
        document.title = "Sign in | AgriChat";
    }, []);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
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
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-semibold">
                            Welcome to AgriChat
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium transition hover:bg-gray-50"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                        >
                            <path
                                fill="#4285F4"
                                d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M6.54 13.58A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.09.31-1.58V7.89H3.3A9.5 9.5 0 0 0 2.5 12c0 1.53.37 2.98 1.03 4.11l3.01-2.53Z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 6.39c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.5 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.01 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
                            />
                        </svg>

                        Continue with Google
                    </button>

                    {isError && (
                        <p className="mt-4 text-center text-sm text-gray-500">
                            You are not currently signed in.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}