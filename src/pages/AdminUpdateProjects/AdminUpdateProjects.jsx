import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import EditProjectDialog from "./EditProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import { Input } from "@/components/ui/input";

export default function AdminUpdateProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [dialogType, setDialogType] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterMember, setFilterMember] = useState("");
  const [filterInternship, setFilterInternship] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => api.get("/projects/all").then((res) => res.data),
    staleTime: 1000 * 60 * 10,
  });

  const openEditDialog = (project) => {
    setSelectedProject(project);
    setDialogType("edit");
  };

  const openDeleteDialog = (project) => {
    setSelectedProject(project);
    setDialogType("delete");
  };

  const closeDialog = () => {
    setSelectedProject(null);
    setDialogType(null);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  const filteredProjects = data.filter((project) => {
    const nameMatch = project.name
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const internshipMatch = project.internship
      .toLowerCase()
      .includes(filterInternship.toLowerCase());
    const members =
      project.members?.map((m) => m.name || m.email).join(" ") || "";
    const memberMatch = members
      .toLowerCase()
      .includes(filterMember.toLowerCase());

    return nameMatch && internshipMatch && memberMatch;
  });

  return (
    <div className="relative max-w-6xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Manage Projects</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <Input
          placeholder="Search by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className={"bg-white shadow-lg"}
        />
        <Input
          placeholder="Search by member"
          value={filterMember}
          onChange={(e) => setFilterMember(e.target.value)}
          className={"bg-white shadow-lg"}
        />
        <Input
          placeholder="Search by internship"
          value={filterInternship}
          onChange={(e) => setFilterInternship(e.target.value)}
          className={"bg-white shadow-lg"}
        />
      </div>

      <table className="w-full border text-sm bg-white shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Internship</th>
            <th className="border px-2 py-1">Year</th>
            <th className="border px-2 py-1">Students</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project._id}>
              <td
                className="border px-2 py-1 max-w-[200px] truncate"
                title={project.name}
              >
                {project.name}
              </td>
              <td
                className="border px-2 py-1 max-w-[150px] truncate"
                title={project.internship}
              >
                {project.internship}
              </td>
              <td className="border px-2 py-1">{project.year}</td>
              <td
                className="border px-2 py-1 max-w-[250px] truncate"
                title={project.members
                  ?.map((m) => m.name || m.email)
                  .join(", ")}
              >
                {project.members?.map((m) => m.name || m.email).join(", ")}
              </td>
              <td className="border px-2 py-1 text-center">
                <Button size="sm" onClick={() => openEditDialog(project)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openDeleteDialog(project)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {dialogType === "edit" && selectedProject && (
        <EditProjectDialog
          project={selectedProject}
          onClose={closeDialog}
          onSave={refetch}
        />
      )}

      {dialogType === "delete" && selectedProject && (
        <DeleteProjectDialog
          project={selectedProject}
          onClose={closeDialog}
          onDelete={refetch}
        />
      )}
    </div>
  );
}
