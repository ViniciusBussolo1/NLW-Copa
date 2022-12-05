import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { api } from "../../../lib/axios";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      session.token = token.idToken;

      return session;
    },
  },
});
