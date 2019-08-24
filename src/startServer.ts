import { GraphQLServer } from 'graphql-yoga'
import { createOrmConnection } from './connection'
import { redis } from './redis';
import { createSchema } from './createSchema';
import { confirmEmail } from "./routes/confirmEmail";
import session from 'express-session';
import connectRedis from 'connect-redis';

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
  });

  const RedisStore = connectRedis(session)

  server.express.use(session({
    name: "qid",
    store: new RedisStore({
      client: redis as any
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'supersecret',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  }))

  server.express.get("/confirm/:id", confirmEmail);

  const port = process.env.NODE_ENV === "test" ? 0 : 4000

  const app = await server.start({
    port,
    cors: {
      credentials: true,
      origin: process.env.NODE_ENV === "test" ? "*" : process.env.FRONTEND_HOST
    }
  });

  console.log(`Server is running on localhost:${port}`);
  return app;
}