export default {
  create: async (parent, args, context) => {
    const { data } = args;
    const { prisma, userId } = context;

    const wallet = await prisma.wallet.create({
      data: { ...data, ownerId: userId },
    });
    return wallet;
  },
  delete: async (parent, args, context) => {
    const { id } = args;
    const { prisma, userId } = context;

    const wallet = await prisma.wallet.findUnique({
      include: { entries: true },
      where: { id },
    });
    if (wallet.ownerId !== userId) {
      return null;
    }

    await prisma.wallet.delete({ where: { id } });
    return wallet;
  },
  read: async (parent, args, context) => {
    const { id } = args;
    const { prisma, userId } = context;

    const wallet = await prisma.wallet.findUnique({
      include: { entries: true },
      where: { id },
    });
    return wallet?.ownerId === userId ? wallet : null;
  },
  readAll: (parent, args, context) => {
    const { prisma } = context;

    return prisma.wallet.findMany({
      include: { entries: true },
    });
  },
  update: async (parent, args, context) => {
    const { id, data } = args;
    const { prisma, userId } = context;

    const wallet = prisma.wallet.findUnique({ where: { id } });
    if (wallet === null || wallet.ownerId !== userId) {
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
