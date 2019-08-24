import axios from "axios";
import { createOrmConnection } from "../../connection";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";

const email = "bob6@bob.com";
const password = "123456";

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`

const meQuery = `
query {
  me {
    userId
    email
  }
}
`

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
    const response = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password)
      }, {
        withCredentials: true
      });


    const [cookieString] = response.headers['set-cookie'];

    const response1 = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      }, {
        headers: {
          Cookie: cookieString
        }
      });

    expect(response1.data.data.me).toEqual({
      userId,
      email
    })
  });
});