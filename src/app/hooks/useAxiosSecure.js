// hooks/useAxiosSecure.js
import axios from "axios";
import useAuth from "./useAuth";

const useAxiosSecure = () => {
  const { logout } = useAuth();
  
  const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
  }); // Added missing closing brace and parenthesis

  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        console.warn("Unauthorized or forbidden error on server");
        // Call logout function
        try {
          await logout();
          // Optional: Redirect to login page
          window.location.href = '/login';
        } catch (logoutError) {
          console.error('Error during logout:', logoutError);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure; // Return the axios instance
};

export default useAxiosSecure;