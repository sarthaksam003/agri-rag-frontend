import { RootLayout } from "@/app/layouts/RootLayout";
import { ConversationPage } from "@/features/conversation/pages/ConversationPage";
import DocumentsPage from "@/features/documents/pages/DocumentsPage";
import SessionPage from "@/features/sessions/pages/SessionsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import { Navigate, Route, Routes } from "react-router-dom";

export function AppRouter() {
  return (
    <Routes>
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

      </Route>    </Routes>
  );
}