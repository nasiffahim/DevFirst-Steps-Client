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
  updateProfile
} from "firebase/auth";
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

import { AuthContext } from "../providers/AuthContext";
import axios from "axios";
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

  // google sign in
  const googleSign = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
const githubSign = () => {
  setLoading(true);
  return signInWithPopup(auth, githubProvider);
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
        axios
          .post(
            "http://localhost:3000/jwt",
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
  }, []);

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
