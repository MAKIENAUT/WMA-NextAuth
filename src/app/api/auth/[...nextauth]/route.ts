import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/app/lib/mongodb';

const getAllowedEmails = (): string[] => {
  const emailsStr = process.env.ALLOWED_EMAILS || '';
  return emailsStr.split(',').map(email => email.trim().toLowerCase());
};

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DATABASE || 'test',
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user',
          isAllowedDashboard: false,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const allowedEmails = getAllowedEmails();
      if (allowedEmails.length > 0 && user.email) {
        return allowedEmails.includes(user.email.toLowerCase());
      }
      return true;
    },
    async session({ session, token }) {
      // Transfer properties from the token to the session
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.isAllowedDashboard = token.isAllowedDashboard;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Transfer properties from the user to the token when signing in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAllowedDashboard = user.isAllowedDashboard;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };