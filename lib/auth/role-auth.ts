import { supabase } from "@/lib/supabase/auth";
// import type { Database } from "@/lib/supabase/database.types";

export type UserRole = 'user' | 'admin' | 'moderator' | 'premium_user';

export interface Permission {
  permission: string;
  resource: string;
  action: string;
}

export class RoleAuthService {
  // Get user's role
  static async getUserRole(supabaseClient, userId: string) {
    try {
      console.log("Getting user role for user:", userId);
      const { data, error } = await supabaseClient
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
      console.error('Error getting user role after try catch:', error);
      return null;
    }
  }

  // Check if user has a specific permission
  static async hasPermission(
    userId: string,
    permission: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_user_permission', {
        user_uuid: userId,
        required_permission: permission,
        resource_name: resource,
        action_name: action,
      });

      if (error) {
        console.error('Error checking permission:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  // Get all permissions for a user
  static async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('user_permissions_view')
        .select('permission, resource, action')
        .eq('user_id', userId);

      if (error) {
        console.error('Error getting user permissions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  // Check if user is admin
  static async isAdmin(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'admin';
  }

  // Check if user is moderator
  static async isModerator(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'moderator' || role === 'admin';
  }

  // Check if user is premium
  static async isPremium(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'premium_user' || role === 'admin' || role === 'moderator';
  }

  // Update user role (admin only)
  static async updateUserRole(
    adminUserId: string,
    targetUserId: string,
    newRole: UserRole
  ): Promise<boolean> {
    try {
      // Check if the current user is admin
      const isAdmin = await this.isAdmin(adminUserId);
      if (!isAdmin) {
        console.error('Only admins can update user roles');
        return false;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', targetUserId);

      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  // Get all users with their roles (admin only)
  static async getAllUsersWithRoles(adminUserId: string) {
    try {
      // Check if the current user is admin
      const isAdmin = await this.isAdmin(adminUserId);
      if (!isAdmin) {
        console.error('Only admins can view all users');
        return [];
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Check if user can access a specific feature
  static async canAccessFeature(
    userId: string,
    feature: 'premium_templates' | 'ai_optimization' | 'advanced_analytics' | 'admin_panel'
  ): Promise<boolean> {
    const permissions = {
      premium_templates: { permission: 'access', resource: 'premium_templates', action: 'all' },
      ai_optimization: { permission: 'access', resource: 'ai_optimization', action: 'unlimited' },
      advanced_analytics: { permission: 'access', resource: 'advanced_analytics', action: 'own' },
      admin_panel: { permission: 'access', resource: 'admin_panel', action: 'limited' },
    };

    const requiredPermission = permissions[feature];
    return await this.hasPermission(
      userId,
      requiredPermission.permission,
      requiredPermission.resource,
      requiredPermission.action
    );
  }

  // Check if user can perform action on resource
  static async canPerformAction(
    userId: string,
    action: 'read' | 'create' | 'update' | 'delete',
    resource: 'resume' | 'user' | 'template',
    resourceOwnerId?: string
  ): Promise<boolean> {
    // If checking for own resource, verify ownership
    if (resourceOwnerId && userId !== resourceOwnerId) {
      // Check if user has permission to access other users' resources
      const hasGlobalPermission = await this.hasPermission(userId, action, resource, 'all');
      if (!hasGlobalPermission) {
        return false;
      }
    }

    // Check specific permission
    const actionType = resourceOwnerId && userId === resourceOwnerId ? 'own' : 'all';
    return await this.hasPermission(userId, action, resource, actionType);
  }
}

// Hook for client-side role checking
export const useRoleAuth = () => {
  const checkPermission = async (
    userId: string,
    permission: string,
    resource: string,
    action: string
  ): Promise<boolean> => {
    return await RoleAuthService.hasPermission(userId, permission, resource, action);
  };

  const getUserRole = async (userId: string): Promise<UserRole | null> => {
    return await RoleAuthService.getUserRole(userId);
  };

  const isAdmin = async (userId: string): Promise<boolean> => {
    return await RoleAuthService.isAdmin(userId);
  };

  const isModerator = async (userId: string): Promise<boolean> => {
    return await RoleAuthService.isModerator(userId);
  };

  const isPremium = async (userId: string): Promise<boolean> => {
    return await RoleAuthService.isPremium(userId);
  };

  return {
    checkPermission,
    getUserRole,
    isAdmin,
    isModerator,
    isPremium,
  };
}; 