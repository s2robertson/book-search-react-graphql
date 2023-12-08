import '../config/env';

import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// set token secret and expiration date
const secret = process.env.JWT_SECRET as string;
if (!secret) {
  throw new Error('Missing environment variable: JWT_SECRET');
}
const expiration = process.env.JWT_EXPIRATION as string;
if (!expiration) {
  throw new Error('Missing environment variable: JWT_EXPIRATION');
}

export interface UserTokenPayload {
  _id: string | Types.ObjectId;
  username: string,
  email: string
}

function extractUserFromRequest(req: Request) {
  if (!req.headers.authorization) {
    return null;
  }

  // ["Bearer", "<tokenvalue>"]
  let token = req.headers.authorization.split(' ').pop()?.trim();
  if (!token) {
    return null;
  }

  // not catching any errors here is deliberate
  // should this use a validation library?
  const { data } = jwt.verify(token, secret, { maxAge: expiration }) as { data: UserTokenPayload };
  return data;
}

// the REST API is no longer being used, so this could be commented out
declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}
// function for our authenticated routes
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
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
}

export function authMiddlewareGraphQL({ req }: { req: Request }) {
  try {
    const user = extractUserFromRequest(req);
    return { user };
  } catch (err) {
    console.log(`Invalid token: ${err}`);
    throw new GraphQLError('Invalid auth token');
  }
}

export function signToken({ username, email, _id }: UserTokenPayload) {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}