"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../../lib/firebase"; 
 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  signOut, 
  updateProfile, 
  GoogleAuthProvider, 
  GithubAuthProvider 
} from "firebase/auth";


import { AuthContext } from "../providers/AuthContext";
import axios from "axios";
import api from "../../utils/api";

const googleProvider = new GoogleAuthProvider();

const githubProvider = new GithubAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // create user
  const userCreate = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // email/password sign in
  const userSign = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
const githubSign = async () => {
  setLoading(true); // Start loading

  try {
    const result = await signInWithPopup(auth, githubProvider); // Trigger GitHub login
    return result;
  } catch (error) {
    console.error("GitHub sign-in failed:", error.message); // Log the error
    throw error; // Re-throw the error
  } finally {
    setLoading(false); // Ensure loading state is reset regardless of success or failure
  }
};


  // google sign in
  const googleSign = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // logout
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };
    const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};
  // update profile
  const updateUser = (update) => {
    return updateProfile(auth.currentUser, update);
  };

  // onAuthStateChanged listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        
        api.post(
            "/jwt",
            { email: currentUser?.email },
            { withCredentials: true }
          )
          .then((result) => {
            console.log("JWT SET:", result.data);
          })
          .catch((err) => {
            console.error("JWT ERROR:", err);
          });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  },[]);

  const userInfo = {
    user,
    setUser,
    userCreate,
    userSign,
    resetPassword,
    googleSign,
    githubSign,
    logout,
    loading,
    updateUser,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
