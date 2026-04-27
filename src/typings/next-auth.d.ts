import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    token?: string;
    user?: {
      id?: string;
      userId?: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    refreshToken?: string;
    isOidc?: boolean;
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    userId: number;
  }

  interface Session {
    token?: string;
    id?: number;
    refreshToken?: string;
    user?: DefaultSession["user"] & { userId?: number };
  }
}
