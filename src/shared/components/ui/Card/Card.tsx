import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-default bg-surface ${className}`}
      {...props}
    />
  );
}