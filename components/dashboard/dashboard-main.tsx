"use client";

import { ArrowUpFromDot } from "lucide-react";

export default function DashboardMain() {
  return (
    <div className="w-full h-full flex flex-col overflow-scroll">
      {/* Top Header - Dark Blue */}
      <div className="h-16 bg-gradient-to-br from-[#e2ebf1] to-[#c9e0db] rounded-md mb-4 flex items-center px-4">
        <h1 className="text-black text-xl font-semibold">Project Name</h1>
      </div>

      {/* Navigation Tabs Row */}
      <div className="flex gap-3 mb-4">
        <div className="h-12 bg-transparent ring-2 ring-gray-300 rounded-md flex-1 flex items-center justify-center">
          <span className="text-black/80 text-sm">Agent 1</span>
        </div>
        <div className="h-12 bg-transparent ring-2 ring-gray-300 rounded-md flex-1 flex items-center justify-center">
          <span className="text-black/80 text-sm">Agent 2</span>
        </div>
        <div className="h-12 bg-transparent ring-2 ring-gray-300 rounded-md flex-1 flex items-center justify-center">
          <span className="text-black/80 text-sm">Agent 3</span>
        </div>
        <div className="h-12 bg-transparent ring-2 ring-gray-300 rounded-md flex-1 flex items-center justify-center">
          <span className="text-black/80 text-sm">Agent 4</span>
        </div>
        <div className="h-12 bg-transparent ring-2 ring-gray-300 rounded-md flex-1 flex items-center justify-center">
          <span className="text-black/80 text-sm">Agent 5</span>
        </div>
      </div>

      {/* Main Content Area - Empty middle section */}
      <div className="flex-1 bg-transparent rounded-md">
        {/* This area is intentionally left empty as per the wireframe */}
      </div>

      {/* Bottom Footer - Dark Blue */}
      <div className="h-16 bg-gray-100 rounded-md mt-4 flex items-center justify-between px-4">
        <span className="text-black text-lg">Enter your Prompt...</span>
        <ArrowUpFromDot />
      </div>
    </div>
  );
}
