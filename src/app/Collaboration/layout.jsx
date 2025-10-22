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
  Code2,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          Preparing your collaboration hub...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* 🔹 Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
  ref={sidebarRef}
  className={`fixed md:static left-0 top-0 h-screen w-72 md:w-64 flex flex-col 
    backdrop-blur-2xl bg-white/20 dark:bg-gray-800/30 
    border border-white/30 dark:border-gray-700/40 shadow-xl transform transition-all duration-300
    ${
      sidebarOpen
        ? "translate-x-0 opacity-100"
        : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
    }`}
>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/40">
          <div className="flex items-center gap-2">
            <Code2 className="text-blue-500 dark:text-green-400 w-5 h-5" />
            <span className="font-bold text-gray-900 dark:text-white">
              Collaboration Hub
            </span>
          </div>

          {/* Close Button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-5 space-y-2 overflow-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-500/80 to-green-500/80 text-white shadow-md"
                      : "text-gray-800 dark:text-gray-300 hover:bg-white/10 hover:text-blue-500 dark:hover:text-green-400"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
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

      {/* 🔹 Main Content */}
      <div className="flex-1 min-h-screen px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Mobile Menu Button */}
        <button
          className="fixed top-20 left-4 md:hidden p-2 rounded-lg bg-white/60 dark:bg-gray-700/60 backdrop-blur-md text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all z-50 shadow-sm"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <main className="max-w-7xl mx-auto text-gray-900 dark:text-gray-100 py-8 transition-colors duration-300">
          {children}
          <ToastContainer position="top-center" />
        </main>
      </div>
    </div>
  );
}
