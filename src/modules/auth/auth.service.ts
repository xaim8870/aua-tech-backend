import { supabaseAdmin } from "../../config/supabase";
import { UserProfile, UserRole } from "./auth.types";

export class AuthService {
  static async verifyAccessToken(token: string) {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new Error("Invalid or expired access token.");
    }

    return data.user;
  }

  static async getProfileById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserProfile | null;
  }

  static async createProfileIfMissing(params: {
    id: string;
    email: string;
    full_name?: string;
    role?: UserRole;
  }): Promise<UserProfile> {
    const existingProfile = await this.getProfileById(params.id);

    if (existingProfile) {
      return existingProfile;
    }

    const payload = {
      id: params.id,
      full_name: params.full_name?.trim() || "New User",
      email: params.email,
      role: params.role || "chat_team",
      status: "active",
    };

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserProfile;
  }
}