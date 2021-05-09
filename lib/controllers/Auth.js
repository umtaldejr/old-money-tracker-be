export default {
  auth: async (parent, args, context) => {
    const { data: { email, password } } = args;
    const {
      bcrypt,
      env: { JWT_SECRET },
      jwt,
      prisma,
    } = context;

    const user = await prisma.user.findUnique({ where: { email } });

    const areCredentialsValid = await bcrypt.compare(password, user.password);
    if (!areCredentialsValid) return null;

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return { token };
  },
};
