import { gql } from "@apollo/client";

export const QUERY_CURRENT_USER = gql`
    query currentUser {
        currentUser {
            ...UserDetails
        }
    }
`;

export function createCurrentUserCacheUpdater(path) {
    return function currentUserCacheUpdater(cache, { data, errors }) {
        if (errors) {
            return;
        }

        let userData = data;
        if (Array.isArray(path)) {
            for (const pathFragment of path) {
                userData = userData[pathFragment];
                if (!userData) {
                    return;
                }
            }
        } else if (path) {
            // string
            userData = userData[path];
            if (!userData) {
                return;
            }
        }

        cache.writeQuery({
            query: QUERY_CURRENT_USER,
            data: { currentUser: userData }
        });
    }
}