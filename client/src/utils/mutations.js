import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
    mutation userLogin($email: String!, $password: String!) {
        userLogin(email: $email, password: $password) {
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