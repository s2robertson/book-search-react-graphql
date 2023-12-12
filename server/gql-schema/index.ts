import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import resolvers from './resolvers.js';
const typeDefs = readFileSync(path.join(__dirname, 'typeDefs.graphql'), { encoding: 'utf-8' });

export { typeDefs, resolvers };