import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      image: string;
      googleId: string;
      username?: string;
      avatarSvg?: string;
      isNewUser?: boolean;
      dbUserId?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    name: string;
    picture: string;
    sub: string;
    username?: string;
    avatarSvg?: string;
    isNewUser?: boolean;
    dbUserId?: number;
  }
}
