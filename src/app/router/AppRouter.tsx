import { RootLayout } from "@/app/layouts/RootLayout";
import { ConversationPage } from "@/features/conversation/pages/ConversationPage";
import DocumentsPage from "@/features/conversation/pages/DocumentsPage";
import SessionsPage from "@/features/conversation/pages/SessionsPage";
import SettingsPage from "@/features/conversation/pages/SettingsPage";
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
          element={<SessionsPage />}
        />

        <Route
          path="/settings"
          element={<SettingsPage />}
        />

      </Route>    </Routes>
  );
}