export default {
  create: async (parent, args, context) => {
    const { data } = args;
    const { prisma, userId } = context;

    const wallet = await prisma.wallet.create({
      data: { ...data, ownerId: userId },
    });
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
};
