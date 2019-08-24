import { User } from "../../entity/User";
import { IResolvers } from "graphql-tools";
// import { createMiddleware } from "../../utils/createMiddleware";
// import middelware from "./middleware";

export const resolvers: IResolvers = {
  Query: {
    me: async (_: any, __: any, { request }: any) => {
      const user = await User.findOne({ where: { id: request.session.userId } });

      if (!user) {
        return null;
      }

      return {
        userId: user.id,
        email: user.email
      };
    }
  }
};
