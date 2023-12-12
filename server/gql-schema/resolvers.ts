import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import {
    getSingleUser,
    createUser,
    saveBook,
    deleteBook,
    login
} from '../controllers/user-controller.js';
import { Resolvers } from './__generated__/resolver-types.js';

const resolvers: Resolvers = {
    Query: {
        me(parent, args, { user }) {
            return user ? getSingleUser(user._id) : null;
        }
    },
    Mutation: {
        async login(parent, args) {
            const loginDetails = await login(args);
            if (!loginDetails) {
                throw new GraphQLError('Invalid login details', {
                    extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT }
                });
            }
            return loginDetails;
        },

        addUser(parent, args) {
            return createUser(args);
        },

        saveBook(parent, { book }, { user }) {
            if (!user) {
                throw new GraphQLError('You must be logged in to save books', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return saveBook(user, book);
        },

        removeBook(parent, { bookId }, { user }) {
            if (!user) {
                throw new GraphQLError('You must be logged in to delete saved books', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return deleteBook(user, bookId);
        }
    }
};

export default resolvers;