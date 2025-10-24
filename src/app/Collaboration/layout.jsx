"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Menu,
  X,
  Users,
  MessageSquare,
  FolderKanban,
  UserPlus,
  HatGlasses,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import api from "../../utils/api";

export default function CollaborationHubLayout({ children }) {
  const pathname = usePathname() ?? "";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { user, loading } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(true);

  // 🔹 Navigation Links
  const navItems = [
    { name: "Overview", href: "/Collaboration", icon: MessageSquare },
    { name: "My Teams", href:"/Collaboration/teams", icon: Users },
    {
      name: "Start New Collaboration",
      href: "/Collaboration/starting-collaboration",
      icon: UserPlus,
    },
    ...(isOwner
    ? [{ name: "Manage Projects", href: "/Collaboration/manage-projects", icon: FolderKanban }]
    : []),
  ];

  // 🔹 Lock body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (sidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [sidebarOpen]);

  // 🔹 Check if user is project owner
  useEffect(() => {
    const checkOwnership = async () => {
      if (!user?.email) return;
      setOwnerLoading(true);
      try {
        const res = await api.get(
          `/collaboration/check-owner?userEmail=${user.email}`
        );
        setIsOwner(res.data.isOwner);
      } catch (err) {
        console.error("Failed to check ownership:", err);
      } finally {
        setOwnerLoading(false);
      }
    };

    checkOwnership();
  }, [user]);

  // 🔹 Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // 🔹 Close sidebar with Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 🔹 Loading State
  if (loading || ownerLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/40 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 dark:border-t-indigo-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        </div>
        <p className="mt-6 text-gray-700 dark:text-gray-300 text-base font-medium">
          Preparing your collaboration hub...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20 transition-all duration-500">
      {/* 🔹 Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static left-0 top-0 w-72 md:w-64 flex flex-col 
          bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
          border-r border-gray-200/60 dark:border-gray-700/60 
          shadow-2xl shadow-blue-500/5 dark:shadow-blue-500/10
          transform transition-all duration-300 ease-out
          ${
            sidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
          }`}
      >
        {/* Header with gradient accent */}
        <div className="relative px-6 py-5 border-b border-gray-200/60 dark:border-gray-700/60">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <HatGlasses className="text-white w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white block text-base">
                  Collaboration Hub
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.name || 'Workspace'}
                </span>
              </div>
            </div>

            {/* Close Button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden
                  ${
                    active
                      ? "text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
                  }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 dark:from-blue-600 dark:via-indigo-600 dark:to-blue-700"></div>
                )}
                <Icon
                  className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                    active
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110"
                  }`}
                />
                <span className="relative z-10">{item.name}</span>
                {active && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer decoration */}
        <div className="px-6 py-4 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Connected</span>
          </div>
        </div>
      </aside>

      {/* 🔹 Main Content */}
      <div className="flex-1 min-h-screen transition-all duration-300">
        {/* Mobile Menu Button with floating effect */}
        <button
          className="fixed top-20 left-4 md:hidden p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all z-40 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 active:scale-95"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <main className="max-w-7xl mx-auto text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {children}
          <ToastContainer 
            position="top-center"
            toastClassName={() => 
              "relative flex p-4 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
            }
          />
        </main>
      </div>
    </div>
  );
}