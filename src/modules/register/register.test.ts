import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { startServer } from "../../startServer";
import { AddressInfo } from "net";
import { Server } from 'http';
import {
  emailAlreadyTaken,
  emailIsTooShort,
  invalidEmail,
  passwordIsTooShort
} from "../../errors";

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

let app: Server | null = null;
let host = '';

beforeAll(async () => {
  app = await startServer();
  const { port } = app.address() as AddressInfo;
  host = `http://127.0.0.1:${port}`;
});

test("Register mutation", async () => {
  // if register successful
  const response1 = await request(host, mutation(email, password));
  expect(response1).toEqual({ register: null });

  const users = await User.find({ where: { email } });
  expect(users[0].email).toEqual(email);
  expect(users[0].password).not.toEqual(password);

  // trying to register with the same email
  const response2 = await request(host, mutation(email, password));
  expect(response2).toEqual({
    register: [
      {
        path: "email",
        message: emailAlreadyTaken
      }
    ]
  });

  // trying to register invalid data
  const response3 = await request(host, mutation("r", "d"));
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

afterAll(async () => {
  if (app) {
    await app.close();
    console.log('Server down');
  }
})