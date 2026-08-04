import { cn } from "@/shared/lib/cn";
import type { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./StatusPill.module.css";

type StatusPillVariant = "simpleRag" | "multiQuery";

interface StatusPillProps
  extends HTMLAttributes<HTMLSpanElement>,
    PropsWithChildren {
  variant?: StatusPillVariant;
}

export function StatusPill({
  variant = "simpleRag",
  children,
  className,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(
        styles.statusPill,
        variant === "multiQuery" && styles.mq,
        className
      )}
      {...props}
    >
      <span className={styles.dot} />
      {children}
    </span>
  );
}