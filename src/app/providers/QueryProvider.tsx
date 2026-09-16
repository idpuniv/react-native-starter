import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import storage, { STORAGE_KEYS } from '@/storage/storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime:    1000 * 60 * 60,
      retry:     2,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Restauration synchrone/asynchrone sans constructeur externe
    const restoreCache = async () => {
      try {
        const cachedString = await storage.getItem(STORAGE_KEYS.QUERY_CACHE);
        if (cachedString) {
          const parsedCache = JSON.parse(cachedString);
          
          // Sécurisation : On injecte directement les données dans le cache de l'instance
          if (parsedCache && Array.isArray(parsedCache.queries)) {
            parsedCache.queries.forEach((queryData: any) => {
              queryClient.setQueryData(queryData.queryKey, queryData.state.data);
            });
          }
        }
      } catch (error) {
        storage.removeItem(STORAGE_KEYS.QUERY_CACHE);
      }
    };

    restoreCache();

    // 2. Sauvegarde ultra-simple via l'état des requêtes
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'success') {
        try {
          const allQueries = queryClient.getQueryCache().getAll().map(query => ({
            queryKey: query.queryKey,
            state: { data: query.state.data }
          }));
          
          storage.setItem(STORAGE_KEYS.QUERY_CACHE, JSON.stringify({ queries: allQueries }));
        } catch (error) {
          console.error("Erreur d'écriture cache:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export { queryClient };