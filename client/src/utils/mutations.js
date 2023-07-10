import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
    mutation userLogin($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                ...UserDetails
            }
            token
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            user {
                ...UserDetails
            }
            token
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($bookId: ID!, $title: String!, $description: String!, $authors: [String], $image: String, $link: String) {
        saveBook(bookId: $bookId, title: $title, description: $description, authors: $authors, image: $image, link: $link) {
            ...UserDetails
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
            ...UserDetails
        }
    }
`;