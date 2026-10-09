import { cn } from "@/shared/lib/cn";
import type { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./StatusPill.module.css";

type StatusPillVariant = "simple" | "multiquery";

interface StatusPillProps
  extends HTMLAttributes<HTMLSpanElement>,
    PropsWithChildren {
  variant?: StatusPillVariant;
}

export function StatusPill({
  variant = "simple",
  children,
  className,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(
        styles.statusPill,
        variant === "multiquery" && styles.mq,
        className
      )}
      {...props}
    >
      <span className={styles.dot} />
      {children}
    </span>
  );
}