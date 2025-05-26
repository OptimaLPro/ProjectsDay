import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUpdateProjectsTable({
  projects,
  userList,
  internships,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>ID</TableHead> */}
            <TableHead>Title</TableHead>
            <TableHead>Internship</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Students</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const memberLabels = project.members
              .map((memberId) => {
                const idStr =
                  typeof memberId === "string"
                    ? memberId
                    : memberId?.$oid || memberId?.toString();
                const user = userList.find((u) => u._id === idStr);
                return user
                  ? `${user.first_name} ${user.last_name} (${user.email})`
                  : "";
              })
              .filter(Boolean)
              .join(", ");

            return (
              <TableRow key={project._id}>
                {/* <TableCell>
                  {project.project_id ? project.project_id : ""}
                </TableCell> */}
                <TableCell
                  className="max-w-[200px] truncate"
                  title={project.name}
                >
                  {project.name}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {internships.find((i) => i._id === project.internship)
                    ?.name || "Unknown"}
                </TableCell>
                <TableCell>{project.year}</TableCell>
                <TableCell
                  className="max-w-[250px] truncate"
                  title={memberLabels}
                >
                  {memberLabels}
                </TableCell>
                <TableCell className="text-center">
                  <Button size="sm" onClick={() => onEdit(project)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => onDelete(project)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
