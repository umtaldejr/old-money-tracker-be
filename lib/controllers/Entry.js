export default {
  create: async (parent, args, context) => {
    const { data } = args;
    const { prisma, userId } = context;

    const { categoryId } = data;
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (category === null || category.ownerId !== userId) {
        return null;
      }
    }

    const { walletId } = data;
    if (walletId) {
      const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
      if (wallet === null || wallet.ownerId !== userId) {
        return null;
      }
    }

    const entry = await prisma.entry.create({
      data: { ...data, ownerId: userId },
    });
    return entry;
  },
  delete: async (parent, args, context) => {
    const { id } = args;
    const { prisma, userId } = context;

    const entry = await prisma.entry.findUnique({
      where: { id },
    });
    if (entry.ownerId !== userId) {
      return null;
    }

    await prisma.entry.delete({ where: { id } });
    return entry;
  },
  read: async (parent, args, context) => {
    const { id } = args;
    const { prisma, userId } = context;

    const entry = await prisma.entry.findUnique({
      where: { id },
    });
    return entry?.ownerId === userId ? entry : null;
  },
  readAll: (parent, args, context) => {
    const { prisma } = context;

    return prisma.entry.findMany();
  },
  update: async (parent, args, context) => {
    const { id, data } = args;
    const { prisma, userId } = context;

    const entry = prisma.entry.findUnique({ where: { id } });
    if (entry === null || entry.ownerId !== userId) {
      return null;
    }

    const { categoryId } = data;
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (category === null || category.ownerId !== userId) {
        return null;
      }
    }

    const { walletId } = data;
    if (walletId) {
      const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
      if (wallet === null || wallet.ownerId !== userId) {
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
