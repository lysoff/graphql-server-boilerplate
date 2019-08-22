import { IResolvers } from "graphql-tools";
import { User } from "../../entity/User";
import * as bcrypt from "bcryptjs";
import {
  invalidLoginError,
  emailNotConfirmedError
} from "./errors"

const resolvers: IResolvers = {
  Query: {
    bye2: () => ''
  },
  Mutation: {
    login: async (_: any, { email, password }: GQL.ILoginOnMutationArguments) => {
      const user = await User.findOne({ email });

      if (!user) {
        return [{
          path: "email",
          message: invalidLoginError
        }]
      }

      if (!user.confirmed) {
        return [{
          path: "email",
          message: emailNotConfirmedError
        }]
      }

      const compareResult = await bcrypt.compare(password, user.password);

      if (!compareResult) {
        return [{
          path: "email",
          message: invalidLoginError
        }]
      }

      return null;
    }
  }
}

export { resolvers };