import { apiPost, apiGet, apiPatch } from "./client";
import { useAuthStore } from "@/stores/authStore";
import type { User, LoginCredentials, RegisterUserDto } from "@/types";

/**
 * Login user
 * Backend sets httpOnly cookie in response
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  const user = await apiPost<User>("/auth/login", credentials);

  // Store user profile (NOT token - that's in httpOnly cookie)
  useAuthStore.getState().setUser(user);

  return user;
}

/**
 * Register new user
 * Backend sets httpOnly cookie in response
 */
export async function signup(data: RegisterUserDto): Promise<User> {
  const user = await apiPost<User>("/auth/signup", data);

  // Store user profile
  useAuthStore.getState().setUser(user);

  return user;
}

/**
 * Logout user
 * Backend clears httpOnly cookie
 */
export async function logout(): Promise<void> {
  await apiPost("/auth/logout");

  // Clear user state
  useAuthStore.getState().logout();
}

/**
 * Get current authenticated user
 * Verifies authentication (cookie sent automatically)
 */
export async function getCurrentUser(): Promise<User> {
  return apiGet<User>("/auth/me");
}

/**
 * Refresh authentication
 * Backend refreshes httpOnly cookie if valid
 */
export async function refreshAuth(): Promise<User> {
  return apiPost<User>("/auth/refresh");
}

/**
 * Update user profile
 */
export async function updateProfile(data: {
  name?: string;
  timezone?: string;
}): Promise<User> {
  const user = await apiPatch<User>("/auth/profile", data);

  // Update stored user profile
  useAuthStore.getState().setUser(user);

  return user;
}
