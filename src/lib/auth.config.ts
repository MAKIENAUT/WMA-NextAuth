import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcrypt';

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
          isTemporaryPassword: false,
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);

        const user = await db.collection('users').findOne({
          email: credentials.email
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in');
        }

        return {
          id: user._id.toString(),
          name: user.username || user.name,
          email: user.email,
          role: user.role || 'user',
          isAllowedDashboard: user.isAllowedDashboard || false,
          isTemporaryPassword: user.isTemporaryPassword || false
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      const allowedEmails = getAllowedEmails();
      if (allowedEmails.length > 0 && user.email) {
        return allowedEmails.includes(user.email.toLowerCase());
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.isAllowedDashboard = token.isAllowedDashboard as boolean;
        session.user.isTemporaryPassword = token.isTemporaryPassword as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAllowedDashboard = user.isAllowedDashboard;
        token.isTemporaryPassword = user.isTemporaryPassword;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};