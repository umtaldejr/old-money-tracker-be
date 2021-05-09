export default (request, jwt, env = process.env) => {
  const token = request.headers?.authorization?.split(' ')[1];
  if (!token) {
    return null;
  }

  const { userId } = jwt.verify(token, env.JWT_SECRET);
  return userId;
};
