import { PrismaClient, User } from '@prisma/client';
import { ContextParameters, Context as ContextType } from 'graphql-yoga/dist/types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import authenticate from './utils/authenticate';

export type Context = ContextType & {
  bcrypt: typeof bcrypt,
  env: NodeJS.ProcessEnv,
  jwt: typeof jwt,
  prisma: PrismaClient,
  userId?: User['id'],
};

const DEFAULT_CONTEXT: Context = {
  bcrypt,
  env: process.env,
  jwt,
  prisma: new PrismaClient(),
};

const context = ({ request }: ContextParameters): Context => {
  const userId = authenticate(request);
  return userId ? { ...DEFAULT_CONTEXT, userId } : DEFAULT_CONTEXT;
}

export default context;
