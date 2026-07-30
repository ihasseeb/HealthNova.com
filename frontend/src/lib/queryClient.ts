import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes tak fresh data
      gcTime: 1000 * 60 * 10, // 10 minutes tak cache
      retry: 1, // Fail hone pe 1 baar retry
      refetchOnWindowFocus: false, // Tab switch pe refetch nahi
    },
    mutations: {
      retry: 0, // Mutations retry nahi
    },
  },
});
