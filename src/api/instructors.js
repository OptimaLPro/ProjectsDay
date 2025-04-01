import axios from "axios";

export const getInstructors = async () => {
  try {
    const response = await axios.get("/api/instructors");
    console.log("Instructors data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
};
