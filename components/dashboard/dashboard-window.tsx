"use client";

import DashboardSidebar from "./dashboard-sidebar";

export default function DashboardWindow() {
  return (
    <div className="w-full h-full bg-white rounded-md border-2 border-black grid grid-cols-18 gap-4 p-4">
      <div className="col-span-1">
        <DashboardSidebar />
      </div>
      <div className="col-span-4">
        <DashboardSidebar />
      </div>
      DashboardWindow
    </div>
  );
}
