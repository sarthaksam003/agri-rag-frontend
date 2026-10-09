import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";

import { queryClient } from "@/app/config/queryClient";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>


        {children}


        {/* {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )} */}

      </QueryClientProvider>
    </BrowserRouter>
  );
}