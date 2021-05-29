import 'dotenv/config';

import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLServer } from 'graphql-yoga';


import context from './context';
import AuthController from './controllers/Auth';
import CategoryController from './controllers/Category';
import EntryController from './controllers/Entry';
import UserController from './controllers/User';
import WalletController from './controllers/Wallet';



const server = new GraphQLServer({
  context,
  resolvers: {
    DateTime: GraphQLDateTime,
    Mutation: {
      auth: AuthController.auth,
      createCategory: CategoryController.create,
      createEntry: EntryController.create,
      createUser: UserController.create,
      createWallet: WalletController.create,
      deleteCategory: CategoryController.delete,
      deleteEntry: EntryController.delete,
      deleteUser: UserController.delete,
      deleteWallet: WalletController.delete,
      updateCategory: CategoryController.update,
      updateEntry: EntryController.update,
      updateUser: UserController.update,
      updateWallet: WalletController.update,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  typeDefs: './lib/schema.graphql',
});

server.start(() => {
  console.log('🚀  Server ready at http://localhost:4000/');
});
