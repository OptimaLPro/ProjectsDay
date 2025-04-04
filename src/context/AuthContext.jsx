import { queryClient } from "@/lib/react-query";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")); // Store token in state
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email, id: decoded.id, role: decoded.role });
      } catch (err) {
        console.error("Invalid token");
        setToken(null);
        localStorage.removeItem("token");
      }
    }
    setIsLoadingUser(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    console.log(decoded);
    setUser({ email: decoded.email, id: decoded.id, role: decoded.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    queryClient.removeQueries(["myProject"]);
  };

  const getRole = () => {
    if (user) {
      return user.role;
    }
    return null; // Return null if user is not defined
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isLoadingUser, getRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
