import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the User type
   */
  interface User {
    id?: string;
    role?: string;
    isAllowedDashboard?: boolean;
    isTemporaryPassword?: boolean;
  }

  /**
   * Extend the Session type
   */
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      isAllowedDashboard?: boolean;
      isTemporaryPassword?: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  /** 
   * Extend the JWT type 
   */
  interface JWT {
    id?: string;
    role?: string;
    isAllowedDashboard?: boolean;
    isTemporaryPassword?: boolean;
  }
}