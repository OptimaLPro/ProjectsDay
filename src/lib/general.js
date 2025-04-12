export const filterProjects = (
  projects,
  searchQuery,
  activeInternship,
  internships
) =>
  projects.filter((project) => {
    const internshipObj = internships?.find(
      (i) => i._id === project.internship
    );
    const internshipName = internshipObj?.name || "";

    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInternship =
      activeInternship === "All" || internshipName === activeInternship;

    return matchesSearch && matchesInternship;
  });
