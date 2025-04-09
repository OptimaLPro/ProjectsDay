import api from "./api";

export const getInstructors = async (year) => {
  try {
    const response = await api.get(`/instructors?year=${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
};
