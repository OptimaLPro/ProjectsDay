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

export const getInstructorById = async (id) => {
  const res = await api.get(`/instructors/${id}`);
  return res.data;
};
