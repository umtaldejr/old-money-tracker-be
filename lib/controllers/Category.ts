export default {
  create: async (parent: any, args: any, context: any) => {
    const { data } = args;
    const { prisma, userId } = context;

    const { superCategoryId } = data;
    if (superCategoryId) {
      const superCategory = await prisma.category.findUnique({ where: { id: superCategoryId } });
      if (superCategory === null || superCategory.ownerId !== userId) {
        return null;
      }
    }

    const category = await prisma.category.create({
      data: { ...data, ownerId: userId },
    });
    return category;
  },
  delete: async (parent: any, args: any, context: any) => {
    const { id } = args;
    const { prisma, userId } = context;

    const category = await prisma.category.findUnique({
      include: { entries: true, subCategories: true },
      where: { id },
    });
    if (category.ownerId !== userId) {
      return null;
    }

    await prisma.category.delete({ where: { id } });
    return category;
  },
  read: async (parent: any, args: any, context: any) => {
    const { id } = args;
    const { prisma, userId } = context;

    const category = await prisma.category.findUnique({
      include: { entries: true, subCategories: true },
      where: { id },
    });
    return category?.ownerId === userId ? category : null;
  },
  readAll: (parent: any, args: any, context: any) => {
    const { prisma } = context;

    return prisma.category.findMany({
      include: { entries: true, subCategories: true },
    });
  },
  update: async (parent: any, args: any, context: any) => {
    const { id, data } = args;
    const { prisma, userId } = context;

    const category = prisma.category.findUnique({ where: { id } });
    if (category === null || category.ownerId !== userId) {
      return null;
    }

    const { superCategoryId } = data;
    if (superCategoryId) {
      const superCategory = await prisma.category.findUnique({ where: { id: superCategoryId } });
      if (superCategory === null || superCategory.ownerId !== userId) {
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
