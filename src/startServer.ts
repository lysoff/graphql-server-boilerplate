
import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { getOrmConnection } from './connection'
import * as fs from 'fs';
// import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';

import * as path from "path";
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

export const startServer = async () => {

  const folders = fs.readdirSync(path.join(__dirname, "./modules"));

  console.log("Folders", folders);
  const schemas: GraphQLSchema[] = [];
  for (const folder of folders) {

    const typeDefs = importSchema(path.join(__dirname, `./modules/${folder}/schema.graphql`));
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const schema = makeExecutableSchema({
      typeDefs, resolvers
    });
    schemas.push(schema);
  }

  console.log("Schemas", schemas);
  const server = new GraphQLServer({ schema: mergeSchemas({ schemas }) })

  await getOrmConnection();
  const app = await server.start({ port: process.env.NODE_ENV === "test" ? 0 : 4000 });

  console.log('Server is running on localhost:4000');
  return app;
}