import { createOrmConnection } from "../../connection";
import { invalidLoginError, emailNotConfirmedError } from "./errors";
import { User } from "../../entity/User";
import { getConnection } from "typeorm";
import { RequestManager } from "../../utils/RequestManager";

const email = "bor@bob.com";
const password = "123456";

beforeAll(async () => {
  await createOrmConnection();
});

afterAll(async () => {
  getConnection().close();
});

describe("Login test", () => {
  test("Check for bad login", async () => {
    const requestManager = new RequestManager(process.env.TEST_HOST as string)
    const response = await requestManager.login("bor@bob.com", "whatever");

    expect(response.data).toEqual({
      login: [{
        path: "email",
        message: invalidLoginError
      }]
    });

    await requestManager.register(email, password)

    const response1 = await requestManager.login(email, password)

    expect(response1.data).toEqual({
      login: [{
        path: "email",
        message: emailNotConfirmedError
      }]
    });

    await User.update({ email }, { confirmed: true });

    const response2 = await requestManager.login(email, "wrong pass")

    expect(response2.data).toEqual({
      login: [{
        path: "email",
        message: invalidLoginError
      }]
    });

    const response3 = await requestManager.login(email, password)

    expect(response3.data).toEqual({
      login: null
    });
  })
})