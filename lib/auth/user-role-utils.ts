import { supabase } from "@/lib/supabase/auth";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { UserRole } from "./role-auth";

/**
 * Get user role from user ID (client-side)
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user role:', error);
      return null;
    }

    return data.role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Get current user's role (client-side)
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return await getUserRole(user.id);
  } catch (error) {
    console.error('Error getting current user role:', error);
    return null;
  }
}

/**
 * Get user role in server components
 */
export async function getUserRoleServer(userId: string): Promise<UserRole | null> {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user role (server):', error);
      return null;
    }

    return data.role;
  } catch (error) {
    console.error('Error getting user role (server):', error);
    return null;
  }
}

/**
 * Get current user's role in server components
 */
export async function getCurrentUserRoleServer(): Promise<UserRole | null> {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return await getUserRoleServer(user.id);
  } catch (error) {
    console.error('Error getting current user role (server):', error);
    return null;
  }
}

/**
 * Get user role in API routes
 */
export async function getUserRoleAPI(userId: string): Promise<UserRole | null> {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user role (API):', error);
      return null;
    }

    return data.role;
  } catch (error) {
    console.error('Error getting user role (API):', error);
    return null;
  }
}

/**
 * Get current user's role in API routes
 */
export async function getCurrentUserRoleAPI(): Promise<UserRole | null> {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return await getUserRoleAPI(user.id);
  } catch (error) {
    console.error('Error getting current user role (API):', error);
    return null;
  }
}

/**
 * Get user profile with role (client-side)
 */
export async function getUserProfileWithRole(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Get current user's profile with role (client-side)
 */
export async function getCurrentUserProfileWithRole() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return await getUserProfileWithRole(user.id);
  } catch (error) {
    console.error('Error getting current user profile:', error);
    return null;
  }
}

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: UserRole | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'user': 1,
    'premium_user': 2,
    'moderator': 3,
    'admin': 4,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole | null): string {
  if (!role) return 'Unknown';
  
  const displayNames: Record<UserRole, string> = {
    'user': 'User',
    'premium_user': 'Premium User',
    'moderator': 'Moderator',
    'admin': 'Administrator',
  };

  return displayNames[role];
}

/**
 * Get role color class for styling
 */
export function getRoleColorClass(role: UserRole | null): string {
  if (!role) return 'text-gray-500';
  
  const colorClasses: Record<UserRole, string> = {
    'user': 'text-gray-600',
    'premium_user': 'text-purple-600',
    'moderator': 'text-orange-600',
    'admin': 'text-red-600',
  };

  return colorClasses[role];
} 