import { generateNamespace } from '@gql2ts/from-schema';
import { createSchema } from '../src/createSchema';
import * as fs from 'fs';
import * as path from 'path';

const genSchema = async () => {
  const schema = await createSchema();
  const namespace = generateNamespace("GQL", schema);
  console.log(__dirname);
  await fs.writeFile(path.join(__dirname, '../src/types/schema.d.ts'), namespace, (err) => {
    if (err) {
      throw err;
    }
  });
}

genSchema();