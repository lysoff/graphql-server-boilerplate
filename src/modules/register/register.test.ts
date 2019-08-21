import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { startServer } from "../../startServer";
import { AddressInfo } from "net";
import { Server } from 'http';

const email = "bor@bob.com";
const password = "123456";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
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
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  expect(users[0].email).toEqual(email);
  expect(users[0].password).not.toEqual(password);

});

afterAll(async () => {
  if (app) {
    await app.close();
    console.log('Server down');
  }
})