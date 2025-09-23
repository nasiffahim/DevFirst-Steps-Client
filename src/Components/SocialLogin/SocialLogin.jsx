"use client";

import React from "react";
import { Chrome, Github } from "lucide-react";
import useAuth from "../../app/hooks/useAuth"; // ✅ Correct import
import { useRouter } from "next/navigation";

const SocialLogin = () => {
  const router = useRouter();
  const { googleSign, githubSign } = useAuth(); // ✅ comes from AuthProvider

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await googleSign();
      console.log("✅ Google User:", result.user);
      router.push("/");
    } catch (error) {
      console.error("❌ Google login error:", error.message);
    }
  };

  // GitHub Login
  const handleGithubLogin = async () => {
    try {
      const result = await githubSign();
      console.log("✅ GitHub User:", result.user);
      router.push("/");
    } catch (error) {
      console.error("❌ GitHub login error:", error.message);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        <Chrome className="w-5 h-5" />
        Google
      </button>

      {/* GitHub */}
      <button
        type="button"
        onClick={handleGithubLogin}
        className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
      >
        <Github className="w-5 h-5" />
        GitHub
      </button>
    </div>
  );
};

export default SocialLogin;
