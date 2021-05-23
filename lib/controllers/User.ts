export default {
  create: async (parent: any, args: any, context: any) => {
    const { data } = args;
    const { bcrypt, prisma } = context;

    const { password } = data;
    const SALT_ROUNDS = 10;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { ...data, password: hash },
    });
    return { ...user, password: null };
  },
  delete: async (parent: any, args: any, context: any) => {
    const { id } = args;
    const { prisma, userId } = context;

    if (id !== userId) {
      return null;
    }

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

    return { ...user, password: null };
  },
  read: async (parent: any, args: any, context: any) => {
    const { id } = args;
    const { prisma, userId } = context;

    if (id !== userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      include: { categories: true, entries: true, wallets: true },
      where: { id },
    });
    return { ...user, password: null };
  },
  readAll: (parent: any, args: any, context: any) => {
    const { prisma } = context;

    return prisma.user.findMany({
      include: { categories: true, entries: true, wallets: true },
    });
  },
  update: async (parent: any, args: any, context: any) => {
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

    const user = await prisma.user.update({
      data,
      where: { id },
    });
    return { ...user, password: null };
  },
};
