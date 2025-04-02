import axios from "axios";

export const getInternships = async () => {
  try {
    const response = await axios.get("/api/internships");
    return response.data;
  } catch (error) {
    console.error("Error fetching internships:", error);
    throw error;
  }
};
