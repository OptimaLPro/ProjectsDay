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
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setIsLoadingUser(false);
      return;
    }

    try {
      const decoded = jwtDecode(savedToken);
      setUser({
        email: decoded.email,
        _id: decoded._id,
        role: decoded.role,
        internship: decoded.internship,
        year: decoded.year,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        image: decoded.image,
        linkedin: decoded.linkedin,
        github: decoded.github,
        website: decoded.website,
        about: decoded.about,
      });
      setToken(savedToken);
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

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
    setUser({
      email: decoded.email,
      _id: decoded._id,
      role: decoded.role,
      internship: decoded.internship,
      year: decoded.year,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      image: decoded.image,
      linkedin: decoded.linkedin,
      github: decoded.github,
      website: decoded.website,
      about: decoded.about,
    });
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
