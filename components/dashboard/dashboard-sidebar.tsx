// DashboardSidebar.js
"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Home,
  Settings,
  User,
} from "lucide-react";

export default function DashboardSidebar() {
  const [expandedItems, setExpandedItems] = useState({
    mainWorkspace: true,
    personalProjects: false,
  });

  const toggleExpand = (item: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item as keyof typeof prev],
    }));
  };

  return (
    <div className="w-64 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo and Title */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">PV</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            PureVibe
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            My Workspace
          </h2>

          {/* Personal Projects */}
          <div className="mb-2">
            <button
              onClick={() => toggleExpand("personalProjects")}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {expandedItems.personalProjects ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <Folder className="w-4 h-4 mr-2" />
              <span>Personal Projects</span>
            </button>

            {expandedItems.personalProjects && (
              <div className="ml-6 mt-1 space-y-1">
                <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                  Project Alpha
                </div>
                <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                  Mobile App
                </div>
              </div>
            )}
          </div>

          {/* Main Workspace */}
          <div className="mb-2">
            <button
              onClick={() => toggleExpand("mainWorkspace")}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {expandedItems.mainWorkspace ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <FolderOpen className="w-4 h-4 mr-2" />
              <span>Main Workspace</span>
            </button>

            {expandedItems.mainWorkspace && (
              <div className="ml-6 mt-1 space-y-1">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  UX Project
                </div>
                <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                  Landing Design
                </div>
                <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                  SEO
                </div>
                <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                  Brainstorm
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Account
          </h2>
          <div className="space-y-1">
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </div>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              U
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              User Name
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
