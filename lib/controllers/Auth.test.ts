import { MockContext, Context, createMockContext } from '../context';

import Auth from './Auth';

import { User } from '.prisma/client';

describe('controllers/Auth', () => {
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = (mockCtx as unknown) as Context;
  });

  describe.only('+ auth', () => {
    const args = {
      data: {
        email: 'example@example.com',
        password: '123456',
      },
    };

    it('should call findUnique with the correct parameters', async () => {
      await Auth.auth(null, args, ctx);
      expect(
        mockCtx.prisma.user.findUnique,
      ).toHaveBeenCalledWith({ where: { email: 'example@example.com' } });
    });

    describe('when the user does not exist', () => {
      it('should return null', async () => {
        mockCtx.prisma.user.findUnique.mockResolvedValue(null);
        expect(
          await Auth.auth(null, args, ctx),
        ).toBe(null);
      });
    });

    describe('when the user exists', () => {
      beforeEach(() => {
        const user: User = {
          id: 1,
          email: 'example@example.com',
          password: 'password',
          createdAt: new Date('2020-01-01T22:45:00.204Z'),
          updatedAt: new Date('2020-01-01T22:45:00.204Z'),
        };
        mockCtx.prisma.user.findUnique.mockResolvedValue(user);
      });

      it('should call bcrypt.compare with the correct parameters', async () => {
        await Auth.auth(null, args, ctx);
        expect(
          mockCtx.bcrypt.compareSync,
        ).toHaveBeenCalledWith('123456', 'password');
      });

      describe('if the credentials are invalid', () => {
        it('should return null', async () => {
          mockCtx.bcrypt.compareSync.mockReturnValue(false);
          expect(
            await Auth.auth(null, args, ctx),
          ).toBe(null);
        });
      });

      describe('if the credentials are valid', () => {
        beforeEach(() => {
          mockCtx.bcrypt.compareSync.mockReturnValue(true);
        });

        it('should call jwt.sign with the correct parameters', async () => {
          await Auth.auth(null, args, ctx);
          expect(
            mockCtx.jwt.sign,
          ).toHaveBeenCalledWith({ userId: 1 }, 'secret');
        });

        it('should return an object containing the token', async () => {
          mockCtx.jwt.sign.mockImplementation(() => 'encodedtoken');
          expect(
            await Auth.auth(null, args, ctx),
          ).toEqual({ token: 'encodedtoken' });
        });
      });
    });
  });
});
