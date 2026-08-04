type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      {children}
    </div>
  );
}