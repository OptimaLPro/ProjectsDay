import { queryClient } from "@/lib/react-query";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // 👈 נעקב אחרי טעינה

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email, id: decoded.id, role: decoded.role });
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
    setIsLoadingUser(false); // 👈 גם אם אין טוקן
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser({ email: decoded.email, id: decoded.id, role: decoded.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    queryClient.removeQueries(["myProject"]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
