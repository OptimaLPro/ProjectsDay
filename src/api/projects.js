import api from "@/api/api";

export const getProjects = async (page = 0, year) => {
  const res = await api.get(`/projects?page=${page}&year=${year}`);
  return res.data;
};

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const checkMyProject = async () => {
  try {
    const response = await api.get("/projects/mine/check");
    return response.data;
  } catch (error) {
    console.error("Error checking project:", error);
    throw error;
  }
};

export const unassignMyself = async () => {
  try {
    const response = await api.put("/projects/unassign");
    return response.data;
  } catch (error) {
    console.error("Error unassigning myself:", error);
    throw error;
  }
};
