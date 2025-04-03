import { useMutation } from "@tanstack/react-query";
import api from "../api/api.js";

export const useRegister = () =>
  useMutation({
    mutationFn: ({ email, password }) =>
      api.post("/auth/register", { email, password }).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }) =>
      api.post("/auth/login", { email, password }).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });

  export const logout = () => {
    localStorage.removeItem("token");
  };
  