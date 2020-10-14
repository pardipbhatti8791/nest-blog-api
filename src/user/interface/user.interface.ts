

export interface UserInterface {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string
  role?: UserRole
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  HR = "hr",
  PROJECT_MANAGER = "project_manager",
  EDITOR = "editor",
  CHIEF_EDITOR = 'chief_editor'
}