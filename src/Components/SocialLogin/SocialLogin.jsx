"use client";

import React from "react";
import { Chrome, Github } from "lucide-react";
import useAuth from "../../app/hooks/useAuth"; //  Correct import
import {  useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";



const SocialLogin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
   const redirect = searchParams.get("redirect") || "/";
   
   


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

    // Send user data to your backend
    await axios.post("http://localhost:5000/login", payload);

    Swal.fire({
      icon: "success",
      title: "Login Successful 🎉",
      text: `Welcome back, ${user.displayName || "User"}!`,
      timer: 2000,
      showConfirmButton: false,
    });

    router.replace(redirect);
  } catch (error) {
    if (axios.isAxiosError?.(error)) {
      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: error.response?.data?.message || error.message,
      });
    } else if (error.code === "auth/popup-closed-by-user") {
      Swal.fire({
        icon: "warning",
        title: "Popup Closed ⚠️",
        text: "You closed the sign-in popup before completing login.",
      });
    } else if (error.code === "auth/cancelled-popup-request") {
      Swal.fire({
        icon: "warning",
        title: "Login Cancelled ⚠️",
        text: "Another sign-in request was already in progress.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error ❌",
        text: error.message || "Something went wrong during Google login.",
      });
    }
  }
};
  // GitHub Login

const handleGithubLogin = async () => {
  try {
    Swal.fire({
      title: "Signing in...",
      text: "Please wait while we log you in with GitHub.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Sign in using GitHub
    const result = await githubSign();
    const user = result.user;
    const providerData = user.providerData;
    const provider = providerData[0];

    const payload = {
      uid: provider?.uid,
      email: provider?.email,
      fullName: provider?.displayName,
      image: provider?.photoURL,
      role: "user",
      work: null,
    };

    // Send user data to your backend
    const rep = await axios.post("http://localhost:5000/login", payload);
    if (rep.data) {
       Swal.fire({
      icon: "success",
      title: "Login Successful 🎉",
      text: `Welcome, ${provider?.displayName || "User"}!`,
      timer: 2000,
      showConfirmButton: false,
    });
    }
   

    // Redirect to homepage
    router.replace(redirect);

  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData?.email;
      const pendingCred = GithubAuthProvider.credentialFromError(error);

      if (email && pendingCred) {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes("google.com")) {
          Swal.fire({
            icon: "warning",
            title: "Email Already Registered ⚠️",
            text: "This email is linked to Google. Please sign in with Google instead.",
          });
          await handleGoogleSignIm(pendingCred); // Handle Google sign-in
        } else {
          Swal.fire({
            icon: "warning",
            title: "Account Conflict ⚠️",
            text: `This account is linked to a different provider: ${methods.join(", ")}`,
          });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: error.message || "Something went wrong during GitHub login.",
      });
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
