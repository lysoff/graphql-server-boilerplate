import { request } from 'graphql-request';
import { User } from '../../entity/User';

import {
  emailAlreadyTaken,
  emailIsTooShort,
  invalidEmail,
  passwordIsTooShort
} from "./errors";
import { createOrmConnection } from '../../connection';
import { getConnection } from 'typeorm';

const email = "bob@bob.com";
const password = "123456";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;


beforeAll(async () => {
  await createOrmConnection();
});

afterAll(async () => {
  await getConnection().close();
});

describe("Register mutation", () => {
  test("check if register works", async () => {
    // if register successful
    const response1 = await request(process.env.TEST_HOST as string, mutation(email, password));
    expect(response1).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users[0].email).toEqual(email);
    expect(users[0].password).not.toEqual(password);
  });

  test("check duplicate email", async () => {
    // trying to register with the same email
    const response2 = await request(process.env.TEST_HOST as string, mutation(email, password));
    expect(response2).toEqual({
      register: [
        {
          path: "email",
          message: emailAlreadyTaken
        }
      ]
    });
  })

  test("check invalid data", async () => {
    // trying to register invalid data
    const response3 = await request(process.env.TEST_HOST as string, mutation("r", "d"));
    expect(response3).toEqual({
      register: [
        {
          path: "email",
          message: emailIsTooShort
        },
        {
          path: "email",
          message: invalidEmail
        },
        {
          path: "password",
          message: passwordIsTooShort
        }
      ]
    });
  });
});