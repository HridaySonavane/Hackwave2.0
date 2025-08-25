import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RoleMiddleware } from "@/lib/auth/role-middleware";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: userProfile, error } = await supabase
    .from("user_profiles")
    .select("id, role")
    .eq("id", session?.user.id)
    .single();

  // If accessing auth pages with session, verify user exists before redirecting
  const authRoutes = ["/auth/signin", "/auth/signup"];
  const isAuthRoute = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && session) {
    try {
      // Check if the user exists in the database and get their role
      const { data: userProfile, error } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", session.user.id)
        .single();

      // If user exists, redirect to dashboard
      if (userProfile && !error) {
        // if (userProfile.role === "admin") {
        //   return NextResponse.redirect(new URL(`/admin`, req.url));
        // }
        return NextResponse.redirect(
          new URL(`/dashboard/${session.user.id}`, req.url)
        );
      } else {
        // If user doesn't exist, clear the session and allow access to auth pages
        await supabase.auth.signOut();
        return res;
      }
    } catch (error) {
      // If there's an error checking the user, clear the session and allow access
      await supabase.auth.signOut();
      return res;
    }
  }

  // Check role-based access control
  const roleCheck = await RoleMiddleware.handleRequest(req);
  if (roleCheck) {
    return roleCheck;
  }

  // Protected routes that require authentication
  // const protectedRoutes = ["/create-resume", "/resumes", "/billing"]
  // const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // If accessing protected route without session, redirect to signin
  // if (isProtectedRoute && !session) {
  //   const redirectUrl = new URL("/auth/signin", req.url)
  //   redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
  //   return NextResponse.redirect(redirectUrl)
  // }

  // If accessing /dashboard without userId, redirect to user's dashboard
  if (req.nextUrl.pathname === "/dashboard" && session) {
    return NextResponse.redirect(
      new URL(
        `/dashboard/${session.user.id}?role=${userProfile?.role}`,
        req.url
      )
    );
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
