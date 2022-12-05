import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}

declare module "next-auth" {
  interface Session {
    token?: string;
  }
}
