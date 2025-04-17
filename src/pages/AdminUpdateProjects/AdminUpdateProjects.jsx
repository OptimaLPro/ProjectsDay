import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { Input } from "@/components/ui/input";
import useAllProjects from "@/hooks/useAllProjects";
import { useInternships } from "@/hooks/useInternships";
import { useUserEmails } from "@/hooks/useUserEmails";
import { useState } from "react";
import EditProjectDialog from "./AdminEditProjectDialog";
import AdminUpdateProjectsTable from "./AdminUpdateProjectsTable";
import DeleteProjectDialog from "./DeleteProjectDialog";

export default function AdminUpdateProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [dialogType, setDialogType] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterMember, setFilterMember] = useState("");
  const [filterInternship, setFilterInternship] = useState("");

  const { data: internships = [] } = useInternships();
  const { data: userList = [] } = useUserEmails();

  const { data, isLoading, isError, refetch } = useAllProjects();

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

    const internshipObj = internships.find((i) => i._id === project.internship);
    const internshipName = internshipObj?.name || "";
    const internshipMatch = internshipName
      .toLowerCase()
      .includes(filterInternship.toLowerCase());

    const memberDetails = project.members
      .map((memberId) => {
        const idStr =
          typeof memberId === "string"
            ? memberId
            : memberId?.$oid || memberId?.toString();
        const user = userList.find((u) => u._id === idStr);
        return user ? `${user.first_name} ${user.last_name} ${user.email}` : "";
      })
      .join(" ")
      .toLowerCase();

    const memberMatch = memberDetails.includes(filterMember.toLowerCase());

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

      <AdminUpdateProjectsTable
        projects={filteredProjects}
        userList={userList}
        internships={internships}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

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
