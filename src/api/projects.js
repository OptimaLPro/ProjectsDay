import axios from "axios";

export const getProjects = async (page = 0) => {
  const res = await fetch(`/api/projects?page=${page}`);
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
};

export const getProjectById = async (id) => {
  try {
    const response = await axios.get(`/api/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};
