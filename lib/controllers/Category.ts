import { Category as PrismaCategory } from '@prisma/client';

import { Context } from '../context';

type Category = PrismaCategory;
type CreateCategoryInput = Omit<Category, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;
type UpdateCategoryInput = Partial<CreateCategoryInput>;

export default {
  create: async (
    parent: null,
    args: { data: CreateCategoryInput },
    context: Context,
  ): Promise<Category | null> => {
    const { data } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const { superCategoryId } = data;
    if (superCategoryId) {
      const superCategory = await prisma.category.findUnique({ where: { id: superCategoryId } });
      if (!superCategory || superCategory.ownerId !== userId) {
        return null;
      }
    }

    const category = await prisma.category.create({
      data: { ...data, ownerId: userId },
    });
    return category;
  },


  delete: async (
    parent: null,
    args: { id: Category['id'] },
    context: Context,
  ): Promise<Category | null> => {
    const { id } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const category = await prisma.category.findUnique({
      include: { entries: true, subCategories: true },
      where: { id },
    });
    if (!category || category.ownerId !== userId) {
      return null;
    }

    await prisma.category.delete({ where: { id } });
    return category;
  },


  read: async (
    parent: null,
    args: { id: Category['id'] },
    context: Context,
  ): Promise<Category | null> => {
    const { id } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const category = await prisma.category.findUnique({
      include: { entries: true, subCategories: true },
      where: { id },
    });
    return category?.ownerId === userId ? category : null;
  },

  readAll: (
    parent: null,
    args: null,
    context: Context,
  ): Promise<Category[]> => {
    const { prisma } = context;

    return prisma.category.findMany({
      include: { entries: true, subCategories: true },
    });
  },

  update: async (
    parent: null,
    args: { id: Category['id'], data: UpdateCategoryInput },
    context: Context,
  ): Promise<Category | null> => {
    const { id, data } = args;
    const { prisma, userId } = context;

    if (!userId) {
      return null;
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.ownerId !== userId) {
      return null;
    }

    const { superCategoryId } = data;
    if (superCategoryId) {
      const superCategory = await prisma.category.findUnique({ where: { id: superCategoryId } });
      if (!superCategory || superCategory.ownerId !== userId) {
        return null;
      }
    }

    const updatedCategory = await prisma.category.update({
      data,
      include: { entries: true, subCategories: true },
      where: { id },
    });
    return updatedCategory;
  },
};
