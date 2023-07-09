const { AuthenticationError } = require('apollo-server-express');
const { login } = require('../controllers/user-controller')

const resolvers = {
    Query: {
        user() {
            return null;
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