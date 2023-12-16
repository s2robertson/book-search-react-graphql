import { useApolloClient, useReactiveVar, makeVar } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';

import { GET_CURRENT_USER } from './queries';

const ID_TOKEN = 'id_token';
const tokenVar = makeVar(localStorage.getItem(ID_TOKEN));

export function useAuth() {
  const token = useReactiveVar(tokenVar);
  const apolloClient = useApolloClient();
  const navigate = useNavigate();

  return {
    loggedIn: !!token && !isTokenExpired(token),
    login(user, token) {
      localStorage.setItem(ID_TOKEN, token);
      tokenVar(token);
      apolloClient.writeQuery({
        query: GET_CURRENT_USER,
        data: { currentUser: user }
      })
      navigate('/');
    },
    logout() {
      // console.log('logout called');
      localStorage.removeItem(ID_TOKEN);
      tokenVar(null);
      apolloClient.clearStore();
      navigate('/');
    }
  }
}

// check if token is expired
function isTokenExpired(token) {
  try {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    } else return false;
  } catch (err) {
    return false;
  }
}

export function getToken() {
  const token = tokenVar();
  return !token || isTokenExpired(token) ? null : token;
}