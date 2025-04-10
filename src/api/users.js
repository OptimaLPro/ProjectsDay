import api from "./api";

export const getUsersByEmails = async (emails) => {
  const query = emails.map((e) => `emails=${e}`).join("&");
  const res = await api.get(`/auth/users/by-emails?${query}`);
  return res.data;
};
