import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface CurrentUser {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    profile_picture: string | null;
}

export const authApi = {
    async getCurrentUser(): Promise<CurrentUser> {
        const response = await axios.get<CurrentUser>(
            `${API_BASE_URL}/api/auth/me`,
            {
                withCredentials: true,
            }
        );

        return response.data;
    },
    async getGoogleAuthorizationUrl(): Promise<string> {
        const response = await axios.get<{ authorization_url: string }>(
            `${API_BASE_URL}/api/auth/google/authorize`
        );

        return response.data.authorization_url;
    },
    async logout(): Promise<void> {
        await axios.post(
            `${API_BASE_URL}/api/auth/logout`,
            undefined,
            {
                withCredentials: true,
            }
        );
    },

    async updateProfilePicture(
        profilePicture: string | null,
    ): Promise<CurrentUser> {
        const response = await axios.put<CurrentUser>(
            `${API_BASE_URL}/api/auth/profile-picture`,
            {
                profile_picture: profilePicture,
            },
            {
                withCredentials: true,
            },
        );

        return response.data;
    },
};
