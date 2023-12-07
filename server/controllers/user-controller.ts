// import user model
import { User, UserType } from '../models/User.js';
import { BookType } from '../models/Book.js';
// import sign token function from auth
import { signToken } from '../utils/auth';

interface UserToken extends Pick<UserType, 'username' | 'email'> {
  _id: string;
}

// get a single user by either their id or their username
export function getSingleUser(userId: string) {
  return User.findById(userId).exec();
}

// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
export async function createUser(userDetails: UserType) {
  const user = await User.create(userDetails)
  const token = signToken(user);
  return { token, user };
}

// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
// {body} is destructured req.body
export async function login(credentials: Pick<UserType, 'email' | 'password'>) {
  const { email, password } = credentials;
  
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const correctPw = await user.isCorrectPassword(password);
  if (!correctPw) {
    return null;
  }
  const token = signToken(user);
  return { token, user };
}

// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
export async function saveBook(user: UserToken, body: BookType) {
  // console.log(user);
  return User.findOneAndUpdate(
    { _id: user._id },
    { $addToSet: { savedBooks: body } },
    { new: true, runValidators: true }
  ).exec();
}

// remove a book from `savedBooks`
export async function deleteBook(user: UserToken, bookId: string) {
  return User.findOneAndUpdate(
    { _id: user._id },
    { $pull: { savedBooks: { bookId } } },
    { new: true }
  ).exec();
}
