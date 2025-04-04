import api from "./api";

export const getInternships = async () => {
  try {
    const response = await api.get("/api/internships");
    return response.data;
  } catch (error) {
    console.error("Error fetching internships:", error);
    throw error;
  }
};
