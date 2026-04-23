export type UserRole = "admin" | "chat_team" | "content_team";

export type ProfileStatus = "active" | "inactive";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}