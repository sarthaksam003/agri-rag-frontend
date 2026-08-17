import { AppRouter } from "@/app/router/AppRouter";
import { useAuthSync } from "@/features/auth/hooks/useAuthSync";
export function App() {
  useAuthSync();
  return <AppRouter />;
}