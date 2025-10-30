"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  FolderPlus,
  FolderOpen,
  Bookmark,
  PenSquare,
  FileText,
  MessageSquare,
  MessagesSquare,
  UserSearch,
  Trophy,
  Settings,
  Home,
  Code,
  Users,
  Sun,
  Moon,
  Award,
  UserPlus2,
  ListVideo,
  ChevronLeft,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import api from "../../utils/api";

export default function Layout({ children }) {
  const pathname = usePathname() ?? "";
  const isRootDashboard =
    pathname === "/dashboard" || pathname === "/dashboard/";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { theme, setTheme } = useTheme();

  // store role from API
  const [role, setRole] = useState(null);
  const { user, loading } = useAuth();
  const email = user?.email;

  // fetch user role on mount
  useEffect(() => {
    if (!email) return;

    const fetchRole = async () => {
      try {
        const res = await api.get(`/user-role`, {
          params: { email },
        });
        setRole(res.data.role);
      } catch (err) {
        console.error("Failed to fetch role", err);
      }
    };

    fetchRole();
  }, [email]);

  // dynamic nav items based on role with icons
  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/profile", icon: User },

    ...(role === "admin"
      ? [
          { name: "All Users", href: "/dashboard/all-users", icon: Users },
          {
            name: "Mentorship Request",
            href: "/dashboard/mentor-approval",
            icon: Settings,
          },
          { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
        ]
      : role === "mentor"
      ? [
          {
            name: "Add Projects",
            href: "/dashboard/add-projects",
            icon: FolderPlus,
          },
          {
            name: "My Projects",
            href: "/dashboard/my-projects",
            icon: FolderOpen,
          },
          { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
          { name: "Add Blogs", href: "/dashboard/add-blogs", icon: PenSquare },
          { name: "My Blogs", href: "/dashboard/my-blogs", icon: FileText },
          {
            name: "Start a Discussion",
            href: "/dashboard/discussion",
            icon: MessageSquare,
          },
          {
            name: "My Discussions",
            href: "/dashboard/my-discussion",
            icon: MessagesSquare,
          },
          {
            name: "Session Request",
            href: "/dashboard/sessionRequest",
            icon: UserPlus2,
          },
          {
            name: "Schedules a Session",
            href: "/dashboard/sessionForm",
            icon: FolderPlus,
          },
          { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
        ]
      : role === "user"
      ? [
          {
            name: "Add Projects",
            href: "/dashboard/add-projects",
            icon: FolderPlus,
          },
          {
            name: "My Projects",
            href: "/dashboard/my-projects",
            icon: FolderOpen,
          },
          { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
          { name: "Add Blogs", href: "/dashboard/add-blogs", icon: PenSquare },
          { name: "My Blogs", href: "/dashboard/my-blogs", icon: FileText },
          {
            name: "Start a Discussion",
            href: "/dashboard/discussion",
            icon: MessageSquare,
          },
          {
            name: "My Discussions",
            href: "/dashboard/my-discussion",
            icon: MessagesSquare,
          },
          {
            name: "Become a Mentor",
            href: "/dashboard/become-mentor",
            icon: Award,
          },
          {
            name: "Find a Mentor",
            href: "/dashboard/find-mentor",
            icon: UserSearch,
          },
          {
            name: "My Session",
            href: "/dashboard/my-session",
            icon: ListVideo,
          },
          { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
        ]
      : []),
  ];

  // lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [sidebarOpen]);

  // close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
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
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal={sidebarOpen ? "true" : "false"}
        className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col`}
      >
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Dashboard
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                DevFirst Steps
              </p>
            </div>
          </div>

          {/* Right side - Theme toggle and close button */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Hidden on mobile */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:block p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Close button - Only on mobile */}
            <button
              className="md:hidden text-gray-600 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <Link href="/">
              <ChevronLeft />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-gray-900 dark:bg-gray-800 text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? "text-white" : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        {isRootDashboard && (
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <button
                className="md:hidden text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Mobile Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </header>
        )}

        <main className="">
          <div className="max-w-7xl mx-auto">{children}</div>
          <ToastContainer position="top-center" />
        </main>
      </div>
    </div>
  );
}
