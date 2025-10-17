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
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import api from "../../utils/api";

export default function CollaborationHubLayout({ children }) {
  const pathname = usePathname() ?? "";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { user, loading } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [ownerloading, setOwnerLoading] = useState(true);

  const navItems = [
    { name: "Overview", href: "/Collaboration", icon: MessageSquare },
    // { name: "Team Feed", href: "/collaboration-hub", icon: MessageSquare },
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

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [sidebarOpen]);

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
      setOwnerLoading(false);
      console.error("Failed to check ownership:", err);
    } finally {
      setOwnerLoading(false);
    }
  };

  checkOwnership(); 
}, [user]);


  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar with Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading || ownerloading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-300 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`  backdrop-blur-2xl bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/40 shadow-2xl transform transition-all duration-300 
          ${
            sidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
          }
          md:flex md:flex-col`}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 md:hidden transition"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-500/80 to-green-500/80 text-white shadow-md"
                      : "text-gray-800 dark:text-gray-300 hover:bg-white/10 hover:text-blue-500 dark:hover:text-green-400"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-green-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen   px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Mobile menu button */}
        <button
          className="fixed top-20 left-4 md:hidden p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-md text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all z-50"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <main className="max-w-7xl mx-auto text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {children}
          <ToastContainer position="top-center" />
        </main>
      </div>
    </div>
  );
}
