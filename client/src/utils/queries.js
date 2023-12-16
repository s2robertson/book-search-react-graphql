import { gql } from "@apollo/client";

export const GET_ME = gql`
    query currentUser {
        currentUser: me {
            ...UserDetails
        }
    }
`;