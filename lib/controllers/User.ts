import { User as PrismaUser } from '@prisma/client';

import { Context } from '../context';

type User = PrismaUser;
type UserOutput = Omit<User, 'password'>;
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateUserInput = Partial<CreateUserInput>;

export default {
  create: async (
    parent: null,
    args: { data: CreateUserInput },
    context: Context,
  ): Promise<UserOutput | null> => {
    const { data } = args;
    const { bcrypt, prisma } = context;

    const { password } = data;
    const SALT_ROUNDS = 10;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...user } = await prisma.user.create({
      data: { ...data, password: hash },
    });
    return user;
  },

  delete: async (
    parent: null,
    args: { id: User['id'] },
    context: Context,
  ): Promise<UserOutput | null> => {
    const { id } = args;
    const { prisma, userId } = context;

    if (id !== userId) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await prisma.user.findUnique({
      include: { categories: true, entries: true, wallets: true },
      where: { id },
    });

    await prisma.$transaction([
      prisma.wallet.deleteMany({ where: { ownerId: userId } }),
      prisma.category.deleteMany({ where: { ownerId: userId } }),
      prisma.entry.deleteMany({ where: { ownerId: userId } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return user;
  },

  read: async (
    parent: null,
    args: { id: User['id'] },
    context: Context,
  ): Promise<UserOutput | null> => {
    const { id } = args;
    const { prisma, userId } = context;

    if (id !== userId) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await prisma.user.findUnique({
      include: { categories: true, entries: true, wallets: true },
      where: { id },
    });
    return user;
  },

  readAll: (
    parent: null,
    args: null,
    context: Context,
  ): Promise<User[]> => {
    const { prisma } = context;

    return prisma.user.findMany({
      include: { categories: true, entries: true, wallets: true },
    });
  },

  update: async (
    parent: null,
    args: { id: User['id'], data: UpdateUserInput },
    context: Context,
  ): Promise<UserOutput | null> => {
    const { id, data: _data } = args;
    const { bcrypt, prisma, userId } = context;

    if (id !== userId) {
      return null;
    }

    const { password } = _data;
    const SALT_ROUNDS = 10;
    const data = password
      ? { ..._data, password: await bcrypt.hash(password, SALT_ROUNDS) }
      : _data;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...user } = await prisma.user.update({
      data,
      where: { id },
    });
    return user;
  },
};
