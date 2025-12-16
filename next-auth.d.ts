//This file extends NextAuth’s Session type to include a custom user.id field while preserving the default session fields, 
// giving full TypeScript safety when accessing session.user.id across the app.


import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
