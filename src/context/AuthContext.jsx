import { queryClient } from "@/lib/react-query";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [year, setYear] = useState(null);
  const [isLoadingYear, setIsLoadingYear] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
        setToken(null);
        localStorage.removeItem("token");
      }
    }
    setIsLoadingUser(false);
  }, [token]);

  useEffect(() => {
    const fetchYearbook = async () => {
      try {
        const res = await api.get("/yearbooks/active");
        setYear(res.data.year);
      } catch (err) {
        console.error("Failed to fetch active yearbook:", err);
      } finally {
        setIsLoadingYear(false);
      }
    };
    fetchYearbook();
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    setUser({ email: decoded.email, id: decoded.id, role: decoded.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    queryClient.removeQueries(["myProject"]);
  };

  const getRole = () => user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoadingUser,
        getRole,
        year,
        setYear,
        isLoadingYear,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
