import { GraphQLServer } from 'graphql-yoga'
import { createOrmConnection } from './connection'
import { redis } from './redis';
import { createSchema } from './createSchema';
import { confirmEmail } from "./routes/confirmEmail";

export const startServer = async () => {
  await createOrmConnection(process.env.NODE_ENV === "test");
  const schema = await createSchema();

  const server = new GraphQLServer({
    schema,
    context: ({ request }) => ({
      request,
      redis,
      host: `${request.protocol}://${request.get('host')}`
    })
  })

  server.express.get("/confirm/:id", confirmEmail);

  const app = await server.start({ port: process.env.NODE_ENV === "test" ? 0 : 4000 });

  console.log('Server is running on localhost:4000');
  return app;
}