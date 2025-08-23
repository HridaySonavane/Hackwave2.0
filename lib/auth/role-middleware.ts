import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RoleAuthService } from "./role-auth";
import { supabase } from "../supabase/auth";

export type RouteConfig = {
  path: string;
  roles?: string[];
  permissions?: Array<{
    permission: string;
    resource: string;
    action: string;
  }>;
};

export class RoleMiddleware {
  private static routeConfigs: RouteConfig[] = [
    // Admin routes
    {
      path: "/admin",
      roles: ["admin"],
    },
    {
      path: "/admin/users",
      roles: ["admin"],
      permissions: [
        { permission: "manage", resource: "users", action: "all" },
      ],
    },
    {
      path: "/admin/analytics",
      roles: ["admin"],
      permissions: [
        { permission: "view", resource: "analytics", action: "all" },
      ],
    },

    // Moderator routes
    {
      path: "/moderator",
      roles: ["admin", "moderator"],
    },
    {
      path: "/moderator/content",
      roles: ["admin", "moderator"],
      permissions: [
        { permission: "moderate", resource: "content", action: "all" },
      ],
    },

    // Premium user routes
    {
      path: "/premium",
      roles: ["admin", "moderator", "premium_user"],
    },
    {
      path: "/premium/templates",
      roles: ["admin", "moderator", "premium_user"],
      permissions: [
        { permission: "access", resource: "premium_templates", action: "all" },
      ],
    },

    // API routes
    {
      path: "/api/admin",
      roles: ["admin"],
    },
    {
      path: "/api/moderator",
      roles: ["admin", "moderator"],
    },
  ];

  static async handleRequest(req: NextRequest): Promise<NextResponse | null> {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null; // Let the main middleware handle authentication
    }

    const pathname = req.nextUrl.pathname;
    const routeConfig = this.findRouteConfig(pathname);

    if (!routeConfig) {
      return null; // No specific role requirements for this route
    }

    // Check if user has required role
    if (routeConfig.roles) {
      const userRole = await RoleAuthService.getUserRole(supabase, session.user.id);
      if (!userRole || !routeConfig.roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/auth/signin?error=insufficient_permissions", req.url));
      }
    }

    // Check if user has required permissions
    if (routeConfig.permissions) {
      for (const permission of routeConfig.permissions) {
        const hasPermission = await RoleAuthService.hasPermission(
          session.user.id,
          permission.permission,
          permission.resource,
          permission.action
        );

        if (!hasPermission) {
          return NextResponse.redirect(new URL("/auth/signin?error=insufficient_permissions", req.url));
        }
      }
    }

    return null; // Allow access
  }

  private static findRouteConfig(pathname: string): RouteConfig | null {
    return this.routeConfigs.find((config) => pathname.startsWith(config.path)) || null;
  }

  // Add a new route configuration
  static addRouteConfig(config: RouteConfig) {
    this.routeConfigs.push(config);
  }

  // Remove a route configuration
  static removeRouteConfig(path: string) {
    this.routeConfigs = this.routeConfigs.filter((config) => config.path !== path);
  }

  // Get all route configurations
  static getRouteConfigs(): RouteConfig[] {
    return [...this.routeConfigs];
  }
}

// Helper function to check if user can access a specific route
export async function canAccessRoute(
  userId: string,
  path: string
): Promise<boolean> {
  const routeConfig = RoleMiddleware.getRouteConfigs().find((config) =>
    path.startsWith(config.path)
  );

  if (!routeConfig) {
    return true; // No restrictions
  }

  // Check role requirements
  if (routeConfig.roles) {
    const userRole = await RoleAuthService.getUserRole(supabase, userId);
    if (!userRole || !routeConfig.roles.includes(userRole)) {
      return false;
    }
  }

  // Check permission requirements
  if (routeConfig.permissions) {
    for (const permission of routeConfig.permissions) {
      const hasPermission = await RoleAuthService.hasPermission(
        userId,
        permission.permission,
        permission.resource,
        permission.action
      );

      if (!hasPermission) {
        return false;
      }
    }
  }

  return true;
}

// Helper function to get accessible routes for a user
export async function getAccessibleRoutes(userId: string): Promise<string[]> {
  const userRole = await RoleAuthService.getUserRole(supabase,userId);
  if (!userRole) return [];

  const accessibleRoutes: string[] = [];

  for (const config of RoleMiddleware.getRouteConfigs()) {
    if (config.roles && config.roles.includes(userRole)) {
      accessibleRoutes.push(config.path);
    }
  }

  return accessibleRoutes;
} 