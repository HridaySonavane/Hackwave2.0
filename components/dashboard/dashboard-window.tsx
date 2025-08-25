// DashboardWindow.js
"use client";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardContent from "./dashboard-content";

export default function DashboardWindow() {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-auto">
      <div className="flex h-full">
        <DashboardSidebar />
        <DashboardContent />
      </div>
    </div>
  );
}
