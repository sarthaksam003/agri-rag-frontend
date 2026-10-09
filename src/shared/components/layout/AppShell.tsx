type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="flex h-screen overflow-hidden">
        {children}
      </div>
    </>
  );
}