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
  onEdit,
  onDelete,
}) {
  return (
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
          {projects.map((project) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
