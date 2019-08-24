import { createOrmConnection } from "../../connection";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";
import { RequestManager } from "../../utils/RequestManager";

const email = "bob6@bob.com";
const password = "123456";

let userId = '';

beforeAll(async () => {
  await createOrmConnection();

  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();

  userId = user.id;
});

afterAll(async () => {
  await getConnection().close();
});

describe("Me", () => {
  test("Check if it works", async () => {
    const requestManager = new RequestManager(process.env.TEST_HOST as string)
    await requestManager.login(email, password)
    const response1 = await requestManager.me()

    expect(response1.data.me).toEqual({
      userId,
      email
    })
  });
});