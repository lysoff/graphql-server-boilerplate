import { getConnectionOptions, createConnection } from 'typeorm';

export const getOrmConnection = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  const connection = await createConnection({ ...connectionOptions, name: "default" });
  return connection;
};
