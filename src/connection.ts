import { getConnectionOptions, createConnection, Connection } from 'typeorm';

export const createOrmConnection = async (dropSchema = false) => {
  let connection: Connection;

  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  connection = await createConnection({ ...connectionOptions, name: "default", dropSchema });
  return connection;
};
