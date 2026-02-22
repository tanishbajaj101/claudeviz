import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByGoogleId } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.picture;
      session.user.googleId = token.sub;
      session.user.username = token.username;
      session.user.avatarSvg = token.avatarSvg;
      session.user.isNewUser = token.isNewUser;
      session.user.dbUserId = token.dbUserId;
      return session;
    },
    async jwt({ token, account }) {
      // On sign-in (account present), look up user in DB
      if (account) {
        const dbUser = getUserByGoogleId(account.providerAccountId);
        if (dbUser) {
          token.name = dbUser.name;
          token.username = dbUser.username;
          token.avatarSvg = dbUser.avatar_svg;
          token.dbUserId = dbUser.id;
          token.isNewUser = false;
        } else {
          token.isNewUser = true;
        }
      }

      // On subsequent requests when isNewUser is true, re-check DB
      // (handles post-onboarding completion)
      if (token.isNewUser && token.sub) {
        const dbUser = getUserByGoogleId(token.sub);
        if (dbUser) {
          token.name = dbUser.name;
          token.username = dbUser.username;
          token.avatarSvg = dbUser.avatar_svg;
          token.dbUserId = dbUser.id;
          token.isNewUser = false;
        }
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
