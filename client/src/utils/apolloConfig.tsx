import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    from
} from '@apollo/client';
import { gql } from '../__generated__/gql';
import { createFragmentRegistry } from '@apollo/client/cache';
import { setContext } from '@apollo/client/link/context';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { RestLink } from 'apollo-link-rest';

import { getToken } from './auth';
import { googleBooksTransformer } from './queries';

const httpLink = new HttpLink({ uri: '/graphql' });
const authLink = setContext((_, { headers = {} }) => {
  let token = getToken();
  
  let result = {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
  return result;
});
const restLink = new RestLink({
    uri: 'https://www.googleapis.com/books/v1',
    responseTransformer: googleBooksTransformer
});
const removeTypenameLink = removeTypenameFromVariables();

const userDetailsFragment = gql(`
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
`);

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    fragments: createFragmentRegistry(userDetailsFragment)
  }),
  link: from([removeTypenameLink, restLink, authLink, httpLink])
});

function ApolloApp({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={client}>{children}</ApolloProvider>
    )
}

export default ApolloApp;