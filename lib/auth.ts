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
        token.exp = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.expires as Date;
      return session;
    }
  }
});
