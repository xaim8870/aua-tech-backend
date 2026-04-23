import { UserProfile } from "../../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
      profile?: UserProfile;
      token?: string;
    }
  }
}

export {};