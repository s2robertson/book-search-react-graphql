import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    ApolloLink,
    concat,
    gql
} from '@apollo/client';
import { createFragmentRegistry } from '@apollo/client/cache';

import { getToken } from './auth';

const httpLink = new HttpLink({ uri: '/graphql' });
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    let token = getToken();
    
    let result = {
      headers: {
        ...headers
      }
    }
    if (token) {
      result.headers.authorization = `Bearer ${token}`;
    }
    return result;
  });

  return forward(operation);
});


const userDetailsFragment = gql`
fragment UserDetails on User {
  _id
  username
  email
  savedBooks {
      bookId
      title
      description
      authors
      image
      link
  }
}
`;

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    fragments: createFragmentRegistry(userDetailsFragment)
  }),
  link: concat(authMiddleware, httpLink)
});

function ApolloApp({ children }) {
    return (
        <ApolloProvider client={client}>{children}</ApolloProvider>
    )
}

export default ApolloApp;