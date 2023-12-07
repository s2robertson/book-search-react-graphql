import { Schema, model, InferSchemaType } from "mongoose";
import bcrypt from 'bcrypt';

import { bookSchema } from "./Book.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // set savedBooks to be an array of data that adheres to the bookSchema
    savedBooks: [bookSchema],
  },
  // set this to use virtual below
  {
    methods: {
      isCorrectPassword(password: string) {
        return bcrypt.compare(password, this.password);
      }
    },
    virtuals: {
      bookCount: {
        get() {
          return this.savedBooks.length;
        }
      }
    },
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        delete ret.password;
        return ret;
      }
    },
  }
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

export const User = model('User', userSchema);
export type UserType = InferSchemaType<typeof userSchema>;