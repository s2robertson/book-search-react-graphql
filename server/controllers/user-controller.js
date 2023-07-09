// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

module.exports = {
  // get a single user by either their id or their username
  getSingleUser(userId) {
    return User.findById(userId).exec();
  },
  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: 'Something is wrong!' });
    }
    const token = signToken(user);
    res.json({ token, user });
  },
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async login(credentials) {
    const { username, email, password } = credentials;
    let queryDoc = {};
    if (username && email) {
      queryDoc = { $or: [{ username }, { email }]};
    } else if (username) {
      queryDoc = { username };
    } else if (email) {
      queryDoc = { email };
    } else {
      return null;
    }

    const user = await User.findOne(queryDoc);
    if (!user) {
      return null;
    }

    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
      return null;
    }
    const token = signToken(user);
    return { token, user };
  },
  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  async saveBook(user, body) {
    // console.log(user);
    return User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { savedBooks: body } },
      { new: true, runValidators: true }
    ).exec();
  },
  // remove a book from `savedBooks`
  async deleteBook({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
  },
};
