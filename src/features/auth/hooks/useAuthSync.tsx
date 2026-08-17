import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/apiAuth";
import { AUTH_QUERY_KEY, useAuth } from "./useAuth";

const AUTH_CHANNEL_NAME = "agri-chat-auth";
const LOGIN_ANNOUNCED_KEY = "agri-chat-login-announced";

type AuthEvent =
    | { type: "logout" }
    | { type: "login" };

export const useAuthSync = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    /*
     * Broadcast this tab's successful authentication to other tabs.
     *
     * sessionStorage is deliberately used here because it is unique
     * to each browser tab.
     */
    useEffect(() => {
        if (isLoading || !isAuthenticated) {
            return;
        }

        const alreadyAnnounced =
            sessionStorage.getItem(LOGIN_ANNOUNCED_KEY) === "true";

        if (alreadyAnnounced) {
            return;
        }

        sessionStorage.setItem(LOGIN_ANNOUNCED_KEY, "true");

        broadcastAuthEvent({ type: "login" });
    }, [isAuthenticated, isLoading]);

    /*
     * Listen for authentication changes from other tabs.
     */
    useEffect(() => {
        if (!("BroadcastChannel" in window)) {
            return;
        }

        const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);

        const handleMessage = async (
            event: MessageEvent<AuthEvent>,
        ) => {
            if (event.data?.type === "logout") {
                sessionStorage.removeItem(LOGIN_ANNOUNCED_KEY);

                queryClient.removeQueries({
                    queryKey: AUTH_QUERY_KEY,
                });

                navigate("/login", { replace: true });

                return;
            }

            if (event.data?.type === "login") {
                try {
                    const user = await queryClient.fetchQuery({
                        queryKey: AUTH_QUERY_KEY,
                        queryFn: authApi.getCurrentUser,
                        retry: false,
                    });

                    if (user) {
                        sessionStorage.setItem(
                            LOGIN_ANNOUNCED_KEY,
                            "true",
                        );


                        navigate("/chat", { replace: true });
                    }
                } catch {
                    /*
                     * Authentication was not available yet.
                     * Leave this tab unauthenticated.
                     */
                    queryClient.removeQueries({
                        queryKey: AUTH_QUERY_KEY,
                    });
                }
            }
        };

        channel.addEventListener("message", handleMessage);

        return () => {
            channel.removeEventListener("message", handleMessage);
            channel.close();
        };
    }, [navigate, queryClient]);
};

export const broadcastAuthEvent = (event: AuthEvent) => {
    if (!("BroadcastChannel" in window)) {
        return;
    }

    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);

    channel.postMessage(event);

    channel.close();
};