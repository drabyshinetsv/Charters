"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const ReactQueryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary, error }) => {
                toast.error(error.message, {
                  id: error.message,
                });
                return (
                  <div className="flex flex-col items-center justify-center gap-4 p-4">
                    There was an error!
                    <Button onClick={() => resetErrorBoundary()}>
                      Try again
                    </Button>
                  </div>
                );
              }}
            >
              {children}
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
