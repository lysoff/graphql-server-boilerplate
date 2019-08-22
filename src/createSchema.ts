import * as path from "path";
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import'
import * as fs from 'fs';

export const createSchema = async () => {
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));

  const schemas: GraphQLSchema[] = [];
  for (const folder of folders) {

    const typeDefs = importSchema(path.join(__dirname, `./modules/${folder}/schema.graphql`));
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const schema = makeExecutableSchema({
      typeDefs, resolvers
    });
    schemas.push(schema);
  }

  return mergeSchemas({ schemas });
}