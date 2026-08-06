import Sidebar from "@/app/layouts/Sidebar/Sidebar";
import { TopBar } from "./TopBar/TopBar";
import { AppShell } from "@/shared/components/layout/AppShell";
import { AppMain } from "@/shared/components/layout/AppMain";
import styles from "./RootLayout.module.css";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <AppShell>
      <Sidebar />
      <div className={styles.content}>
        <TopBar />
        <AppMain >
          <Outlet />
        </AppMain >
      </div>
    </AppShell>);
}