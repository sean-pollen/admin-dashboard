import NextAuth, { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
  }
}
