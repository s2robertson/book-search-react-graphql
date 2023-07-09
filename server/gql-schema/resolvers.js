const { AuthenticationError } = require('apollo-server-express');
const {
    getSingleUser,
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
        }
    }
};

module.exports = resolvers;