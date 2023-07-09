import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
    mutation userLogin($email: String!, $password: String!) {
        userLogin(email: $email, password: $password) {
            user {
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
            token
        }
    }
`;