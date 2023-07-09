import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat
} from '@apollo/client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

import Auth from './utils/auth';

const httpLink = new HttpLink({ uri: '/graphql' });
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    let token = Auth.getToken();
    if (token && Auth.isTokenExpired(token)) {
      token = null;
    }

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
})

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route 
              path='/' 
              element={<SearchBooks />} 
            />
            <Route 
              path='/saved' 
              element={<SavedBooks />} 
            />
            <Route 
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
