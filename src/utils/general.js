export const filterProjects = (projects, searchQuery, activeCategory) =>
  projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || project.category === activeCategory;

    return matchesSearch && matchesCategory;
  });
