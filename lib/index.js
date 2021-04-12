require('dotenv').config();

import { PrismaClient } from '@prisma/client';
import { GraphQLServer } from 'graphql-yoga';

const prisma = new PrismaClient();

const typeDefs = `
  type User {
    email: String!
    password: String
  }
  type Query {
    allUsers: [User!]!
  }
`;

const resolvers = {
  Query: {
    allUsers: () => {
      return prisma.user.findMany();
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('🚀  Server ready at http://localhost:4000/'));
