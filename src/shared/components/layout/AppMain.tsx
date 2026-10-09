import type { PropsWithChildren } from "react";

export function AppMain({ children }: PropsWithChildren) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 flex flex-col overflow-hidden min-h-0"
    >
      {children}
    </main>
  );
}