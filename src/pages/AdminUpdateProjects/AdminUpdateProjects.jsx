import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import EditProjectDialog from "./EditProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          className="bg-white shadow-lg"
        />
        <Input
          placeholder="Search by member"
          value={filterMember}
          onChange={(e) => setFilterMember(e.target.value)}
          className="bg-white shadow-lg"
        />
        <Input
          placeholder="Search by internship"
          value={filterInternship}
          onChange={(e) => setFilterInternship(e.target.value)}
          className="bg-white shadow-lg"
        />
      </div>

      <div className="rounded-md bg-white border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Internship</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Students</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project._id}>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={project.name}
                >
                  {project.name}
                </TableCell>
                <TableCell
                  className="max-w-[150px] truncate"
                  title={project.internship}
                >
                  {project.internship}
                </TableCell>
                <TableCell>{project.year}</TableCell>
                <TableCell
                  className="max-w-[250px] truncate"
                  title={project.members
                    ?.map((m) => m.name || m.email)
                    .join(", ")}
                >
                  {project.members?.map((m) => m.name || m.email).join(", ")}
                </TableCell>
                <TableCell className="text-center">
                  <Button size="sm" onClick={() => openEditDialog(project)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => openDeleteDialog(project)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
