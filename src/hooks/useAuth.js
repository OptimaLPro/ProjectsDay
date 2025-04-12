import { useMutation } from "@tanstack/react-query";
import api from "../api/api.js";

export const useLogin = (onSuccess) => {
  return useMutation({
    mutationFn: ({ email, password }) =>
      api.post("/auth/login", { email, password }).then((res) => res.data),
    onSuccess: (data) => {
      onSuccess(data.token);
    },
  });
};

export const useRegister = (onSuccess) => {
  return useMutation({
    mutationFn: ({ email, password }) =>
      api.post("/auth/register", { email, password }).then((res) => res.data),
    onSuccess: (data) => {
      onSuccess(data.token);
    },
  });
};
