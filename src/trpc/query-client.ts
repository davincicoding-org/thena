import {
  defaultShouldDehydrateQuery,
  keepPreviousData,
  QueryClient,
} from "@tanstack/react-query";
// import {  } from "@tanstack/react-query-persist-client";
// import { del, get, set } from "idb-keyval";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        // persister: experimental_createPersister({
        //   storage: {
        //     getItem: get,
        //     setItem: set,
        //     removeItem: del,
        //   },
        //   maxAge: 24 * 60 * 60 * 1000,
        // }),
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
