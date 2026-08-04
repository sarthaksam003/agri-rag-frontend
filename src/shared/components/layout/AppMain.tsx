import type { PropsWithChildren } from "react";

export function AppMain({ children }: PropsWithChildren) {
  return (
    <main className="flex-1 overflow-auto">
      {children}
    </main>
  );
}