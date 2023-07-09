const { AuthenticationError } = require('apollo-server-express');
const {
    getSingleUser,
    saveBook,
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

        saveBook(parent, args, { user }) {
            // console.log(`Saving book, user=${user}, book=${JSON.stringify(args)}`)
            return saveBook(user, args);
        }
    }
};

module.exports = resolvers;