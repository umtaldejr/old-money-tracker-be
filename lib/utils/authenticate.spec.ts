import authenticate from './authenticate';

describe('authenticate', () => {
  describe('when the request does not have an Authorization header', () => {
    it('should return null', () => {
      const request = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = authenticate(request as any);
      expect(result).toBe(null);
    });
  });

  describe('when the request has an Authorization header', () => {
    describe('with no token', () => {
      it('should return null', () => {
        const request = {
          headers: {
            authorization: 'Bearer',
          },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = authenticate(request as any);
        expect(result).toBe(null);
      });
    });

    describe('with a valid token', () => {
      let token: string;
      let request: {
        headers: {
          authorization: string,
        },
      };

      beforeEach(() => {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyMDYwNjM0OH0.EmO2WD4UB4IO_aROUXqsF44PoLJTZcXDxG65ojloUt8';
        request = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
      });

      it('should call the verify method with the correct arguments', () => {
        const env = { JWT_SECRET: 'secret' };
        const jwt = { verify: jest.fn(() => ({ userId: 1 })) };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authenticate(request as any, env, jwt as any);
        expect(jwt.verify).toHaveBeenCalledWith(token, env.JWT_SECRET);
      });

      it('should return the userId from the verify result', () => {
        const env = { JWT_SECRET: 'secret' };
        const userId = 1;
        const jwt = { verify: jest.fn(() => ({ userId })) };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = authenticate(request as any, env, jwt as any);
        expect(result).toBe(userId);
      });
    });

    describe('when the verify method fails', () => {
      it('should return null', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyMDYwNjM0OH0.EmO2WD4UB4IO_aROUXqsF44PoLJTZcXDxG65ojloUt';
        const request = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        const env = { JWT_SECRET: 'secret' };
        const jwt = {
          verify: jest.fn(() => {
            throw Error();
          }),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = authenticate(request as any, env, jwt as any);
        expect(result).toBe(null);
      });
    });
  });
});
