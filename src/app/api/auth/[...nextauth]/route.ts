// src/app/api/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Parse comma-separated emails from environment variable
const getAllowedEmails = () => {
  const emailsStr = process.env.ALLOWED_EMAILS || "";
  return emailsStr.split(",").map(email => email.trim().toLowerCase());
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Fixed pages to match your actual route structure
  pages: {
    signIn: "/signin",
    signOut: "/signout", // Updated to match your route structure
    error: "/signin", // You might want to create a dedicated error page in the (auth) group
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all Google sign-ins
      return true;
    },
    async session({ session, token, user }) {
      // Add custom claims to the session
      if (session.user && session.user.email) {
        const allowedEmails = getAllowedEmails();
        // Add a flag to indicate if the user can access the dashboard
        session.user.isAllowedDashboard = allowedEmails.includes(session.user.email.toLowerCase());
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        
        // Add dashboard access flag to token
        if (user.email) {
          const allowedEmails = getAllowedEmails();
          token.isAllowedDashboard = allowedEmails.includes(user.email.toLowerCase());
        }
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };