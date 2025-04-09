import api from "./api";

export const getInternships = async (year) => {
  try {
    const res = await api.get(`/internships?year=${year}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching internships:", error);
    throw error;
  }
};
