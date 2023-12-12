import dbConnection from './config/connection.js';

import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { URL, fileURLToPath } from 'node:url';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs, resolvers } from './gql-schema/index.js';
import { authMiddlewareGraphQL, UserContext } from './utils/auth.js';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;

const apolloServer = new ApolloServer<UserContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

Promise.all([dbConnection, apolloServer.start()]).then(() => {
  app.use(cors(), express.json())
  app.use('/graphql', expressMiddleware(apolloServer, { context: authMiddlewareGraphQL }));

  if (process.env.NODE_ENV === 'production') {
    // if we're in production, serve client/build as static assets
    app.use(express.static(fileURLToPath(new URL('../../client/build', import.meta.url))));

    // and a fallback route for react router
    app.use((req, res) => {
      res.sendFile(fileURLToPath(new URL('../../client/build/index.html', import.meta.url)));
    });
  }

  httpServer.listen({ port: PORT }, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});