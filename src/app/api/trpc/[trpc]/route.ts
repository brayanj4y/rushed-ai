import { appRouter } from '@/trpc/routers/_app';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}), // customize if you have a context
  });

export { handler as GET, handler as POST };
