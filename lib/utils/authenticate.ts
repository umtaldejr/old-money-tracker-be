import jsonwebtoken from 'jsonwebtoken';

export default (request: any, env = process.env, jwt = jsonwebtoken) => {
  const token = request?.headers?.authorization?.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    const { userId } = jwt.verify(token, env.JWT_SECRET as any) as any;
    return userId;
  } catch (e) {
    return null;
  }
};
