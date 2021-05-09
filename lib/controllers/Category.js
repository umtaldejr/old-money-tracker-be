export default {
  create: async (parent, args, context) => {
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
  read: async (parent, args, context) => {
    const { id } = args;
    const { prisma, userId } = context;

    const category = await prisma.category.findUnique({
      include: { entries: true, subCategories: true },
      where: { id },
    });
    return category?.ownerId === userId ? category : null;
  },
  readAll: (parent, args, context) => {
    const { prisma } = context;

    return prisma.category.findMany({
      include: { entries: true, subCategories: true },
    });
  },
};
