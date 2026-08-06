import { cn } from "@/shared/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: string;
}

export function IconButton({
  icon,
  className,
  variant,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={variant === "sidebar" ? cn(styles.sidebarIconButton, className) : cn(styles.iconButton, className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}