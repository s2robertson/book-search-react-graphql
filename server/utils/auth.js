require('../config/env');

const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRATION;

function extractUserFromRequest(req) {
  let token = req.body.token || req.query.token  || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return null;
  }

  // not catching any errors here is deliberate
  const { data } = jwt.verify(token, secret, { maxAge: expiration });
  return data;
}

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    try {
      const user = extractUserFromRequest(req);
      if (!user) {
        return res.status(400).json({ message: 'You have no token!' });
      }
      req.user = user;
      next();
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'Invalid token!' });
    }
  },

  authMiddlewareGraphQL({ req }) {
    try {
      const user = extractUserFromRequest(req);
      return { user };
    } catch (err) {
      console.log(`Invalid token: ${err}`);
      throw new GraphQLError('Invalid auth token');
    }
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
