import * as bcrypt from "bcryptjs";
import { IResolvers } from "graphql-tools";
import { User } from "../../entity/User";

const resolvers: IResolvers = {
  Query: {
    bye: () => ''
  },
  Mutation: {
    register: async (_: any, { email, password }: GQL.IRegisterOnMutationArguments) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({ email, password: hashedPassword });
      user.save();
      return true;
    }
  }
}

export { resolvers };