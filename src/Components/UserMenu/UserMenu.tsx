"use client";
import { useState, useRef } from "react";
import useAuth from "../../app/hooks/useAuth";

const UserMenu = () => {
  const auth = useAuth();
  if (!auth) return null;

  const { user, logout } = auth;
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  if (!user) return null;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // 👈 small delay before hiding
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Avatar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="focus:outline-none"
      >
        <img
          src={user.photoURL || "https://i.ibb.co/2M7rtLk/avatar.png"}
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-indigo-500 transition"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border p-2 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-700">
              {user.displayName || "User"}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <ul className="mt-2">
            <li>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                Profile
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
