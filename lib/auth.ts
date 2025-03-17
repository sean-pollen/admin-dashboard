import { db } from 'db';
import { users, profiles } from 'db/schema';
import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

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
  session: {
    strategy: 'jwt',
    maxAge: 3600, // ONE HOUR
    updateAge: 0
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        await handleLogin(account.providerAccountId, profile.email);
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    }
  }
});

export const handleLogin = async (providerId: string, email: string) => {
  const existingUser = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.providerId, `${providerId}`));

  if (existingUser.length === 0) {
    const [user] = await db
      .insert(users)
      .values({
        providerId: providerId,
        email: email,
        createdAt: new Date()
      })
      .returning({ id: users.id });

    await db.insert(profiles).values({
      userId: user.id,
      topAlbums: []
    });
  } else {
    // Update user profile
    await db
      .update(users)
      .set({
        lastLogin: new Date()
      })
      .where(eq(users.providerId, `${providerId}`));
  }
};
