const dbConnection = require('./config/connection');

const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');

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

  if (process.env.NODE_ENV === 'production') {
    // if we're in production, serve client/build as static assets
    app.use(express.static(path.join(__dirname, '../../client/build')));

    // and a fallback route for react router
    app.use((req, res) => {
      res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    });
  }

  httpServer.listen({ port: PORT }, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});