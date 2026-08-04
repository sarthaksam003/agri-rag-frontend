import { cn } from "@/shared/lib/cn";
import type { ButtonProps } from "./Button.types";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "px-4 py-2 rounded bg-brand text-white",

    secondary:
      "px-4 py-2 rounded border border-default bg-surface text-primary",

    ghost:
      "px-4 py-2 rounded text-primary hover:bg-gray-100",
  };

  return (
    <button
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}