import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const providers = [];
const githubId = process.env.AUTH_GITHUB_ID;
const githubSecret = process.env.AUTH_GITHUB_SECRET;

if (githubId && githubSecret) {
  providers.push(
    GitHub({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
  );
}

providers.push(
  CredentialsProvider({
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const appUrl =
        process.env.NEXT_PUBLIC_URL ??
        process.env.NEXTAUTH_URL ??
        process.env.AUTH_URL;
      if (!appUrl) {
        throw new Error("Missing app base URL for credentials authentication.");
      }

      const res: Response = await fetch(`${appUrl}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const user = await res.json();

      return {
        id: user.data.id.toString(),
        userId: user.data.id,
        email: user.data.email,
        name: user.data.name,
      };
    },
  }),
);

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers,
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.user = user;
      }

      if (trigger === "update" && session?.user?.name) {
        token.user = {
          ...token.user,
          name: session.user.name,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.user && typeof token.user === "object" && "userId" in token.user) {
        session.user.userId = token.user.userId as number;
      }

      return session;
    },
  },
});
