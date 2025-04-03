import api from "@/api/api"; // משתמש באינסטנס עם Authorization אוטומטי

export const getProjects = async (page = 0) => {
  const res = await api.get(`/projects?page=${page}`);
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
