const dbConnection = require('./config/connection');

const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { typeDefs, resolvers } = require('./gql-schema');
const { authMiddlewareGraphQL } = require('./utils/auth');
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

Promise.all([dbConnection, apolloServer.start()]).then(() => {
  app.use(cors(), express.json())
  app.use('/graphql', expressMiddleware(apolloServer, { context: authMiddlewareGraphQL }));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  app.use(routes);

  return httpServer.listen({ port: PORT });
}).then(() => {
  console.log(`🌍 Now listening on localhost:${PORT}`);
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});