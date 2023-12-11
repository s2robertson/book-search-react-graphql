// import user model
import { User, UserType } from '../models/User.js';
import { BookType } from '../models/Book.js';
// import sign token function from auth
import { signToken, UserTokenPayload } from '../utils/auth';

type PartialByKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// It looks like InferSchemaType does this by default in mongoose ^8.0
// https://github.com/Automattic/mongoose/issues/12748
type AddNullToOptional<T> = {
  [K in keyof T]: undefined extends T[K] ? T[K] | null : T[K];
}
type UserInput = PartialByKey<UserType, 'savedBooks'>;
type BookInput = AddNullToOptional<PartialByKey<BookType, 'authors'>>;

// get a single user by either their id or their username
export function getSingleUser(userId: string) {
  return User.findById(userId).exec();
}

// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
export async function createUser(userDetails: UserInput) {
  const user = await User.create(userDetails);
  const token = signToken(user);
  return { token, user };
}

// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
// {body} is destructured req.body
type Credentials = Pick<UserType, 'email' | 'password'>
export async function login(credentials: Credentials) {
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
export async function saveBook(user: UserTokenPayload, body: BookInput) {
  // console.log(user);
  return User.findOneAndUpdate(
    { _id: user._id },
    { $addToSet: { savedBooks: body } },
    { new: true, runValidators: true }
  ).exec();
}

// remove a book from `savedBooks`
export async function deleteBook(user: UserTokenPayload, bookId: string) {
  return User.findOneAndUpdate(
    { _id: user._id },
    { $pull: { savedBooks: { bookId } } },
    { new: true }
  ).exec();
}
