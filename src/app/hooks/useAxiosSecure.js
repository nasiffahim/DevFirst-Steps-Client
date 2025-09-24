import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
    
      console.warn("Unauthorized or forbidden error on server");
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
