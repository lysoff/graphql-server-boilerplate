import { getConnectionOptions, createConnection, Connection } from 'typeorm';

export const createOrmConnection = async () => {
  let connection: Connection;

  // try {
  //   connection = getConnection(process.env.NODE_ENV);
  //   return connection;
  // } catch (err) {
  //   console.log(err);
  // }

  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  console.log("-----------------------------");
  console.log("CONOPTIONS", connectionOptions);
  console.log("-----------------------------");
  connection = await createConnection({ ...connectionOptions, name: "default" });
  return connection;
};
