import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { GraphQLServer } from 'graphql-yoga';
import { GraphQLDateTime } from 'graphql-iso-date';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import AuthController from './controllers/Auth';
import CategoryController from './controllers/Category';
import EntryController from './controllers/Entry';
import UserController from './controllers/User';
import WalletController from './controllers/Wallet';
import authenticate from './utils/authenticate';

const prisma = new PrismaClient();

const server = new GraphQLServer({
  context: ({ request }) => {
    const DEFAULT_CONTEXT = {
      bcrypt,
      env: process.env,
      jwt,
      prisma,
    };
    const userId = authenticate(request, jwt);
    return userId ? { ...DEFAULT_CONTEXT, userId } : DEFAULT_CONTEXT;
  },
  resolvers: {
    DateTime: GraphQLDateTime,
    Mutation: {
      auth: AuthController.auth,
      createCategory: CategoryController.create,
      createEntry: EntryController.create,
      createUser: UserController.create,
      createWallet: WalletController.create,
    },
    Query: {
      allCategories: CategoryController.readAll,
      allEntries: EntryController.readAll,
      allUsers: UserController.readAll,
      allWallets: WalletController.readAll,
      category: CategoryController.read,
      entry: EntryController.read,
      user: UserController.read,
      wallet: WalletController.read,
    },
  },
  typeDefs: './lib/schema.graphql',
});

server.start(() => {
  // eslint-disable-next-line no-console
  console.log('🚀  Server ready at http://localhost:4000/');
});
