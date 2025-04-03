export const filterProjects = (projects, searchQuery, activeInternship) =>
  projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInternship =
      activeInternship === "All" || project.internship === activeInternship;

    return matchesSearch && matchesInternship;
  });
