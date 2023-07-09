import { gql } from "@apollo/client";

export const QUERY_CURRENT_USER = gql`
    query currentUser {
        currentUser {
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
    }
`;