import axios from "axios";

export const getProjects = async () => {
  try {
    const response = await axios.get("/api/projects");
    console.log("Projects data:", response.data); // Log the projects data
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await axios.get(`/api/projects/${id}`);
    console.log("Project data:", response.data); // Log the project data
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};
