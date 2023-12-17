import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    ApolloLink,
    from,
    gql
} from '@apollo/client';
import { createFragmentRegistry } from '@apollo/client/cache';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { RestLink } from 'apollo-link-rest';

import { getToken } from './auth';
import { googleBooksTransformer } from './queries';

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
const restLink = new RestLink({
    uri: 'https://www.googleapis.com/books/v1',
    responseTransformer: googleBooksTransformer
});
const removeTypenameLink = removeTypenameFromVariables();

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
  link: from([removeTypenameLink, restLink, authMiddleware, httpLink])
});

function ApolloApp({ children }) {
    return (
        <ApolloProvider client={client}>{children}</ApolloProvider>
    )
}

export default ApolloApp;