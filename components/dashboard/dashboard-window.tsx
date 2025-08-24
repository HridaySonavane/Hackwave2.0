"use client";

import DashboardMain from "./dashboard-main";
import DashboardIconBar from "./dashboard-icons";

export default function DashboardWindow() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#e2ebf1] to-[#c9e0db] rounded-xl border-4 border-black p-6">
      <div className="w-full h-full grid grid-cols-4">
        <div className="col-span-1 bg-white rounded-l-md">
          <DashboardIconBar />
        </div>
        <div className="col-span-3 bg-white p-4 rounded-r-md">
          <DashboardMain />
        </div>
      </div>
    </div>
  );
}
