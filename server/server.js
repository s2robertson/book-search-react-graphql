const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./gql-schema');
const { authMiddlewareGraphQL } = require('./utils/auth');
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  context: authMiddlewareGraphQL
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });
  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  });
});