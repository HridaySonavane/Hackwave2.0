import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
    // Fetch the session to get the user ID
    const { data: { session } } = await supabase.auth.getSession()
    
    // If the session has a user ID, get their role and redirect to their dashboard
    if (session?.user?.id) {
      // Get user profile with role from database
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if(userProfile?.role === 'admin'){
        return NextResponse.redirect(`${requestUrl.origin}/admin`)
      }
      
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }
  }

  // Fallback: redirect to generic dashboard or sign in
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
