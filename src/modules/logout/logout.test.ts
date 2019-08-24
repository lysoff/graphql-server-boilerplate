import { createOrmConnection } from "../../connection";
import { User } from "../../entity/User";
import { getConnection } from "typeorm";
import { RequestManager } from "../../utils/RequestManager";

const email = "bob@bob.com";
const password = "123456";

beforeAll(async () => {
  await createOrmConnection();

  await User.create({
    email,
    password,
    confirmed: true
  }).save();
});

afterAll(async () => {
  getConnection().close();
});

describe("Logout test", () => {
  test("Check for ", async () => {
    const requestManager = new RequestManager(process.env.TEST_HOST as string)
    await requestManager.login(email, password);
    await requestManager.logout();
    const response = await requestManager.me();

    expect(response.data).toEqual({
      me: null
    });
  })
})