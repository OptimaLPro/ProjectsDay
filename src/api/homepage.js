import api from "./api";

export const getHomepageData = async () => {
  const res = await api.get("/homepage");
  return res.data;
};
