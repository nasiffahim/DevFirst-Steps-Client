"use client";

import React from "react";
import { Chrome, Github } from "lucide-react";
import useAuth from "../../app/hooks/useAuth"; //  Correct import
import { useRouter } from "next/navigation";
import axios from "axios";


const SocialLogin = () => {

  const router = useRouter();
  const { googleSign, githubSign } = useAuth(); //  comes from AuthProvider

  // Google Login
const handleGoogleLogin = async () => {
  try {
    const result = await googleSign(); // Firebase popup login
    const user = result.user;

    const payload = {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName,
      image: user.photoURL,
      role: "user",
      work: null,
    };

    //  Send user data to your backend
    await axios.post("http://localhost:5000/login", payload);

    router.push("/");
  } catch (error) {
  
    if (axios.isAxiosError?.(error)) {
      console.error("❌ Axios error:", error.response?.data || error.message);
    } else if (error.code === "auth/popup-closed-by-user") {
      console.warn("⚠️ User closed the popup before completing sign-in.");
    } else if (error.code === "auth/cancelled-popup-request") {
      console.warn("⚠️ Popup request was cancelled.");
    } else {
      console.error("❌ Unexpected error during Google login:", error);
    }
  }
};



  // GitHub Login


const handleGithubLogin = async () => {
  try {
    // Sign in using GitHub
    const result = await githubSign();
    const { user } = result;

    // Payload to send to backend
    const payload = {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName,
      image: user.photoURL,
      role: "user",
      work: null,
    };

    // Send user data to your backend
    await axios.post("http://localhost:5000/login", payload);

    // Redirect to homepage
    router.push("/");

  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData?.email;
      const pendingCred = GithubAuthProvider.credentialFromError(error);

      if (email && pendingCred) {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes("google.com")) {
          console.log("⚠️ Email registered with Google. Please sign in with Google.");
          await handleGoogleSignIn(pendingCred); // Handle Google sign-in
        } else {
          console.log("⚠️ Account exists with a different provider:", methods);
        }
      }
    } else {
      console.error("❌ GitHub login error:", error.message);
    }
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
