import { Wallet as PrismaWallet } from '@prisma/client';

import { Context } from '../context';

type Wallet = PrismaWallet;
type CreateWalletInput = Omit<Wallet, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;
type UpdateWalletInput = Partial<CreateWalletInput>;

export default {
  create: async (
    parent: null,
    args: { data: CreateWalletInput },
    context: Context,
  ): Promise<Wallet | null> => {
    const { data } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const wallet = await prisma.wallet.create({
      data: { ...data, ownerId: userId },
    });
    return wallet;
  },

  delete: async (
    parent: null,
    args: { id: Wallet['id'] },
    context: Context,
  ): Promise<Wallet | null> => {
    const { id } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const wallet = await prisma.wallet.findUnique({
      include: { entries: true },
      where: { id },
    });
    if (!wallet || wallet.ownerId !== userId) {
      return null;
    }

    await prisma.wallet.delete({ where: { id } });
    return wallet;
  },

  read: async (
    parent: null,
    args: { id: Wallet['id'] },
    context: Context,
  ): Promise<Wallet | null> => {
    const { id } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const wallet = await prisma.wallet.findUnique({
      include: { entries: true },
      where: { id },
    });
    return wallet?.ownerId === userId ? wallet : null;
  },

  readAll: (
    parent: null,
    args: null,
    context: Context,
  ): Promise<Wallet[]> => {
    const { prisma } = context;

    return prisma.wallet.findMany({
      include: { entries: true },
    });
  },

  update: async (
    parent: null,
    args: { id: Wallet['id'], data: UpdateWalletInput },
    context: Context,
  ): Promise<Wallet | null> => {
    const { id, data } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const wallet = await prisma.wallet.findUnique({ where: { id } });
    if (!wallet || wallet.ownerId !== userId) {
      return null;
    }

    const updatedWallet = await prisma.wallet.update({
      data,
      include: { entries: true },
      where: { id },
    });
    return updatedWallet;
  },
};
