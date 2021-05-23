import { Secret } from 'jsonwebtoken';

import { Context } from '../context';

type Credentials = {
  email: string
  password: string
}

type AuthToken = {
  token: string
}

export default {
  auth: async (
    parent: null,
    args: { data: Credentials },
    context: Context,
  ): Promise<AuthToken | null> => {
    const { data: { email, password } } = args;
    const {
      bcrypt,
      env: { JWT_SECRET },
      jwt,
      prisma,
    } = context;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    const areCredentialsValid = await bcrypt.compare(password, user.password);
    if (!areCredentialsValid) return null;

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as Secret);
    return { token };
  },
};
