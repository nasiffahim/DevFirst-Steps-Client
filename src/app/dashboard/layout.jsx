"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const pathname = usePathname() ?? "";
  // consider both "/dashboard" and "/dashboard/" as root
  const isRootDashboard =
    pathname === "/dashboard" || pathname === "/dashboard/";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const navItems = [
    { name: "Overview", href: "/dashboard" },
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Add Projects", href: "/dashboard/add-projects" },
    { name: "Projects", href: "/dashboard/projects" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  // lock body scroll when sidebar (mobile) is open
  useEffect(() => {
    if (sidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
    return;
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar (drawer on mobile, fixed on md+) */}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal={sidebarOpen ? "true" : "false"}
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col`}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-xs text-gray-500">DevFirst Steps</p>
          </div>

          {/* close button (mobile only) */}
          <button
            className="md:hidden text-gray-700 p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-150
                  ${
                    active
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                aria-current={active ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t">
          <button className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-h-screen">
        {/* Show welcome header ONLY on Overview page */}
        {isRootDashboard && (
          <header className="bg-white shadow p-6 ">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                className="md:hidden text-gray-700 p-2 rounded hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                👋 Welcome Back!
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Here’s an overview of your activity.
            </p>
          </header>
        )}

        {/* Actual page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
