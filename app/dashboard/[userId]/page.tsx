/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Sparkles, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/auth";
import { User } from "@supabase/auth-helpers-nextjs";
import DashboardWindow from "@/components/dashboard/dashboard-window";
// import { se } from "date-fns/locale";

interface Subscription {
  plan_id: string;
  status: string;
  current_period_end: string;
}

interface UsageData {
  resumes_created: number;
  downloads_used: number;
  ai_optimizations_used: number;
}

export default function DashboardPage() {
  // const { user, loading: authLoading } = useAuth();

  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageData>({
    resumes_created: 0,
    downloads_used: 0,
    ai_optimizations_used: 0,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sessionId, setSessionId] = useState<any>(null);

  const success = searchParams?.get("success");
  // const sessionId = searchParams.get("session_id");

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSessionId(session?.user.id);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      // Check if the userId matches the authenticated user
      if (user.id !== userId) {
        // Redirect to correct user dashboard
        router.push(`/dashboard/${user.id}`);
        return;
      }

      // If coming from successful checkout, sync the subscription
      //   if (success === "true" && sessionId) {
      //     syncSubscription(sessionId);
      //   } else {
      //     loadDashboardData();
      //   }
    } else {
      setLoading(false);
    }
    // if (!authLoading) {
    // }
  }, [user, userId, success, sessionId, router]);

  //   const syncSubscription = async (sessionId: string) => {
  //     setSyncing(true);
  //     try {
  //       const response = await fetch("/api/stripe/sync-subscription", {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ sessionId }),
  //       });

  //       if (response.ok) {
  //         await loadDashboardData();
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("Failed to sync subscription:", error);
  //       setLoading(false);
  //     } finally {
  //       setSyncing(false);
  //     }
  //   };

  //   const loadDashboardData = async () => {
  //     try {
  //       const subscriptionPromise = await fetch(
  //         "/api/stripe/check-subscription",
  //         {
  //           credentials: "include",
  //         }
  //       ).catch(() => null);
  //       const usagePromise = await fetch("/api/usage/current").catch(() => null);

  //       const [subscriptionResponse, usageResponse] = await Promise.all([
  //         subscriptionPromise,
  //         usagePromise,
  //       ]);

  //       if (subscriptionResponse && subscriptionResponse.ok) {
  //         const subscriptionData = await subscriptionResponse.json();
  //         setSubscription(subscriptionData.subscription);
  //       }

  //       if (usageResponse && usageResponse.ok) {
  //         const usageData = await usageResponse.json();
  //         setUsage(usageData);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load dashboard data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  if (syncing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2ebf1] to-[#c9e0db]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {syncing ? "Setting up your subscription..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2ebf1] to-[#c9e0db] dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to access your dashboard.
          </p>
          <Button asChild>
            <a href="/auth/signin">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2ebf1] to-[#c9e0db]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900/75 dark:to-gray-950 p-10">
      {/* <DashboardHeader userId={userId} /> */}
      <DashboardWindow />
    </div>
  );
}
