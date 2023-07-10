const { AuthenticationError } = require('apollo-server-express');
const {
    getSingleUser,
    createUser,
    saveBook,
    deleteBook,
    login
} = require('../controllers/user-controller')

const resolvers = {
    Query: {
        currentUser(parent, args, { user }) {
            return user ? getSingleUser(user._id) : null;
        }
    },
    Mutation: {
        async userLogin(parent, args) {
            const loginDetails = await login(args);
            if (!loginDetails) {
                throw new AuthenticationError('Invalid login details');
            }
            return loginDetails;
        },

        addUser(parent, args) {
            return createUser(args);
        },

        saveBook(parent, args, { user }) {
            // console.log(`Saving book, user=${user}, book=${JSON.stringify(args)}`)
            if (!user) {
                throw new AuthenticationError('You must be logged in to save books');
            }
            return saveBook(user, args);
        },

        deleteBook(parent, { bookId }, { user }) {
            if (!user) {
                throw new AuthenticationError('You must be logged in to delete saved books');
            }
            return deleteBook(user, bookId);
        }
    }
};

module.exports = resolvers;