import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id?: string;
    role?: string;
  }

  interface Session {
    user: {
      _id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: "admin" | "moderator" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "admin" | "moderator" | "user";
  }
}


declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
}