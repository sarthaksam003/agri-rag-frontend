import Sidebar from "@/app/layouts/Sidebar/Sidebar";
import { TopBar } from "./TopBar/TopBar";
import { AppShell } from "@/shared/components/layout/AppShell";
import { AppMain } from "@/shared/components/layout/AppMain";
import styles from "./RootLayout.module.css";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/features/localization/useTranslation";
export function RootLayout() {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const tabNames: Record<string, string> = {
      "/chat": t("navigation.chat"),
      "/documents": t("navigation.documents"),
      "/sessions": t("navigation.sessions"),
      "/settings": t("navigation.settings"),
    };

    const tabName = tabNames[location.pathname] ?? "AgriChat";

    document.title = `${tabName} | AgriChat`;
  }, [location.pathname, t]);

  return (
    <AppShell>
      <Sidebar />
      <div className={styles.content}>
        <TopBar />
        <AppMain>
          <Outlet />
        </AppMain>
      </div>
    </AppShell>
  );
}