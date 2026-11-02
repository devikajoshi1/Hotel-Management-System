import axios from "axios";

// Every request to the backend goes through this one object.
// Locally it uses localhost; on the live site, Vercel sets VITE_API_URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// Attach the login ticket (token) to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// If the server says the ticket is no longer valid, sign the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (error.response?.status === 401 && user?.token) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
