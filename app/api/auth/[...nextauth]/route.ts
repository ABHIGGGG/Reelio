import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

//Handler processes all authentication-related GET and POST HTTP requests in a Next.js App Router setup.
export { handler as GET, handler as POST };
