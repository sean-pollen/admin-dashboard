import { asc } from 'drizzle-orm';
import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        url: 'https://accounts.spotify.com/authorize',
        params: {
          scope:
            'user-read-email user-top-read playlist-modify-private user-library-read'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.exp = (Math.floor(Date.now() / 1000) +
          (account?.expires_in ?? 0)) as number;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (typeof token.exp === 'number') {
        // @ts-ignore
        session.expires = new Date(Date.now() + token.exp * 1000).toISOString();
      }
      return session;
    }
  }
});
