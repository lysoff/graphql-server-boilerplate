import { IResolvers } from "graphql-tools";

const resolvers: IResolvers = {
  Mutation: {
    logout: async (_: any, __: any, { request }) => {
      await request.session.destroy();
      return null;
    }
  }
}

export { resolvers };