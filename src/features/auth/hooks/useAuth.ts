import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/apiAuth";

export const AUTH_QUERY_KEY = ["auth", "current-user"];

export const useAuth = () => {
    const query = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: authApi.getCurrentUser,
        retry: false,
    });

    return {
        user: query.data ?? null,
        isLoading: query.isLoading,
        isAuthenticated: !!query.data,
        isError: query.isError,
    };
};