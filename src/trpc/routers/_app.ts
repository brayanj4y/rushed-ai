
import { messagesRouter } from '../../modules/messages/server/procedure';
import { createTRPCRouter } from '../init';
import { projectsRouter } from '../../modules/projects/server/procedure';

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;