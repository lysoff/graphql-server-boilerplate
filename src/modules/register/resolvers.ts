import * as bcrypt from "bcryptjs";
import { IResolvers } from "graphql-tools";
import { User } from "../../entity/User";
import { formatYupError } from "../../utils/formatYupError";
import {
  emailAlreadyTaken,
  emailIsTooLong,
  emailIsTooShort,
  invalidEmail,
  passwordIsTooShort,
  passwordIsTooLong
} from "../../errors";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailIsTooShort)
    .max(255, emailIsTooLong)
    .email(invalidEmail),
  password: yup
    .string()
    .min(3, passwordIsTooShort)
    .max(255, passwordIsTooLong)
})


const resolvers: IResolvers = {
  Query: {
    bye: () => ''
  },
  Mutation: {
    register: async (_: any, args: GQL.IRegisterOnMutationArguments) => {
      try {
        await validationSchema.validate(args, { abortEarly: false })
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;
      const users = await User.find({ where: { email } });

      if (users.length > 0) {
        return [{
          path: "email",
          message: emailAlreadyTaken
        }]
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({ email, password: hashedPassword });
      user.save();
      return null;
    }
  }
}

export { resolvers };