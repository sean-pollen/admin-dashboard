import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { handleLogin } from 'db/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
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
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        await handleLogin(account.providerAccountId, profile.email);
        token.accessToken = account.access_token;
      }

      token.exp = Date.now() + 3600 * 1000;
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      // @ts-ignore bullshit type error
      session.expires = new Date(token.exp as number).toISOString();
      return session;
    }
  }
});
