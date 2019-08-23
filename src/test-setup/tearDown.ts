import { getConnection } from "typeorm";

export const tearDown = async () => {
  await getConnection().synchronize(true);
};
