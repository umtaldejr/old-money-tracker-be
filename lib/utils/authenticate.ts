import { User } from '@prisma/client';
import { ContextParameters } from 'graphql-yoga/dist/types';
import jsonwebtoken, { Secret } from 'jsonwebtoken';

type DecodedToken = {
  userId: User['id'];
}

export default (
  request: ContextParameters['request'],
  env: NodeJS.ProcessEnv = process.env,
  jwt = jsonwebtoken,
): User['id'] | null => {
  const token = request?.headers?.authorization?.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    const { userId } = jwt.verify(token, env.JWT_SECRET as Secret) as DecodedToken;
    return userId;
  } catch (e) {
    return null;
  }
};
