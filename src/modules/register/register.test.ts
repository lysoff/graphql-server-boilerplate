import { User } from '../../entity/User';
import { RequestManager } from "../../utils/RequestManager";

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

beforeAll(async () => {
  await createOrmConnection();
});

afterAll(async () => {
  await getConnection().close();
});

describe("Register mutation", () => {
  test("check if register works", async () => {
    const requestManager = new RequestManager(process.env.TEST_HOST as string);
    // if register successful
    const response1 = await requestManager.register(email, password)
    expect(response1.data).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users[0].email).toEqual(email);
    expect(users[0].password).not.toEqual(password);
  });

  test("check duplicate email", async () => {
    const requestManager = new RequestManager(process.env.TEST_HOST as string);
    // trying to register with the same email
    const response2 = await requestManager.register(email, password)
    expect(response2.data).toEqual({
      register: [
        {
          path: "email",
          message: emailAlreadyTaken
        }
      ]
    });
  })

  test("check invalid data", async () => {
    const requestManager = new RequestManager(process.env.TEST_HOST as string);
    // trying to register invalid data
    const response3 = await requestManager.register("d", "sd")
    expect(response3.data).toEqual({
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