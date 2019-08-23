import { createOrmConnection } from "../../connection";
import { request } from "graphql-request";
import { invalidLoginError, emailNotConfirmedError } from "./errors";
import { User } from "../../entity/User";
import { getConnection } from "typeorm";

const email = "bob@bob.com";
const password = "123456";

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

beforeAll(async () => {
  await createOrmConnection();
});

afterAll(async () => {
  getConnection().close();
});

describe("Login test", () => {
  test("Check for bad login", async () => {

    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation("bor@bob.com", "whatever")
    );

    expect(response).toEqual({
      login: [{
        path: "email",
        message: invalidLoginError
      }]
    });

    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    const response1 = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    expect(response1).toEqual({
      login: [{
        path: "email",
        message: emailNotConfirmedError
      }]
    });

    await User.update({ email }, { confirmed: true });

    const response2 = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, "wrong password")
    );

    expect(response2).toEqual({
      login: [{
        path: "email",
        message: invalidLoginError
      }]
    });

    const response3 = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    expect(response3).toEqual({
      login: null
    });
  })
})