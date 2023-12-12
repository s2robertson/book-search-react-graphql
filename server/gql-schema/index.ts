import { readFileSync } from 'node:fs';
import { URL, fileURLToPath } from 'node:url';

import resolvers from './resolvers.js';
const typeDefs = readFileSync(fileURLToPath(new URL('./typeDefs.graphql', import.meta.url)), { encoding: 'utf-8' });

export { typeDefs, resolvers };