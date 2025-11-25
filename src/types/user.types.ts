/**
 * User entity from UML class diagram
 */
export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User registration data
 */
export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  timezone: string;
}

/**
 * User authentication credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User profile update data
 */
export interface UpdateUserDto {
  name?: string;
  timezone?: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "en" | "fr";
  notificationsEnabled: boolean;
  emailNotifications: boolean;
}
