import { Navigate, Route, Routes } from "react-router-dom";

import { RootLayout } from "@/app/layouts/RootLayout";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ConversationPage } from "@/features/conversation/pages/ConversationPage";
import DocumentsPage from "@/features/documents/pages/DocumentsPage";
import SessionPage from "@/features/sessions/pages/SessionsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export function AppRouter() {
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
            element={<DocumentsPage />}
          />

          <Route
            path="/sessions"
            element={<SessionPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}