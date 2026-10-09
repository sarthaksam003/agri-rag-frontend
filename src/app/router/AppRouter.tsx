import { Navigate, Route, Routes } from "react-router-dom";

import { RootLayout } from "@/app/layouts/RootLayout";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { ResourceNotFoundScreen } from "@/app/router/ResourceNotFoundScreen";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ConversationPage } from "@/features/conversation/pages/ConversationPage";
import DocumentsPage from "@/features/documents/pages/DocumentsPage";
import SessionPage from "@/features/sessions/pages/SessionsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import { useAuth } from "@/features/auth/hooks/useAuth";
export function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={<Navigate to="/chat" replace />}
          />

          <Route
            path="/chat"
            element={<ConversationPage />}
          />

          <Route
            path="/chat/:conversationId"
            element={<ConversationPage />}
          />

          <Route
            path="/documents"
            element={
              user?.is_superuser
                ? <DocumentsPage />
                : <Navigate to="/chat" replace />
            }
          />

          <Route
            path="/sessions"
            element={<SessionPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
          <Route
            path="*"
            element={<ResourceNotFoundScreen />}
          />
        </Route>
      </Route>
    </Routes>
  );
}