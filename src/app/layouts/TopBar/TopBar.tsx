import { TopBarLeft } from "@/app/layouts/TopBar/TopBarLeft";
import { TopBarRight } from "@/app/layouts/TopBar/TopBarRight";
import styles from "./TopBar.module.css"
export function TopBar() {
  return (
    <header className={styles["topbar"]}>

      <TopBarLeft />

      <TopBarRight />

    </header>
  );
}