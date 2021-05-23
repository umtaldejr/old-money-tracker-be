import { Entry as PrismaEntry } from '@prisma/client';

import { Context } from '../context';

type Entry = PrismaEntry;
type CreateEntryInput = Omit<Entry, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;
type UpdateEntryInput = Partial<CreateEntryInput>;

export default {
  create: async (
    parent: null,
    args: { data: CreateEntryInput },
    context: Context,
  ): Promise<Entry | null> => {
    const { data } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const { categoryId } = data;
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category || category.ownerId !== userId) {
        return null;
      }
    }

    const { walletId } = data;
    if (walletId) {
      const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
      if (!wallet || wallet.ownerId !== userId) {
        return null;
      }
    }

    const entry = await prisma.entry.create({
      data: { ...data, ownerId: userId },
    });
    return entry;
  },

  delete: async (
    parent: null,
    args: { id: Entry['id'] },
    context: Context,
  ): Promise<Entry | null> => {
    const { id } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const entry = await prisma.entry.findUnique({
      where: { id },
    });
    if (!entry || entry.ownerId !== userId) {
      return null;
    }

    await prisma.entry.delete({ where: { id } });
    return entry;
  },

  read: async (
    parent: null,
    args: { id: Entry['id'] },
    context: Context,
  ): Promise<Entry | null> => {
    const { id } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const entry = await prisma.entry.findUnique({
      where: { id },
    });
    return entry?.ownerId === userId ? entry : null;
  },

  readAll: (
    parent: null,
    args: null,
    context: Context,
  ): Promise<Entry[]> => {
    const { prisma } = context;

    return prisma.entry.findMany();
  },

  update: async (
    parent: null,
    args: { id: Entry['id'], data: UpdateEntryInput },
    context: Context,
  ): Promise<Entry | null> => {
    const { id, data } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry || entry.ownerId !== userId) {
      return null;
    }

    const { categoryId } = data;
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category || category.ownerId !== userId) {
        return null;
      }
    }

    const { walletId } = data;
    if (walletId) {
      const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
      if (!wallet || wallet.ownerId !== userId) {
        return null;
      }
    }

    const updatedEntry = await prisma.entry.update({
      data,
      where: { id },
    });
    return updatedEntry;
  },
};
