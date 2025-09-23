import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext";

const useAuth = () => {
  return useContext(AuthContext); // ✅ no destructuring here
};

export default useAuth;

