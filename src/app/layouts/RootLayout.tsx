import Sidebar from "@/app/layouts/Sidebar/Sidebar";
import { TopBar } from "./TopBar/TopBar";
import { AppShell } from "@/shared/components/layout/AppShell";
import { AppMain } from "@/shared/components/layout/AppMain";
import styles from "./RootLayout.module.css";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
export function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    const tabNames: Record<string, string> = {
      "/chat": "Chat",
      "/documents": "Documents",
      "/sessions": "Sessions",
      "/settings": "Settings",
    };

    const tabName = tabNames[location.pathname] ?? "AgriChat";

    document.title = `${tabName} | AgriChat`;
  }, [location.pathname]);
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