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

export default function AdminInternshipsTable({
  internships,
  instructors,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-md bg-white border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Years</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {internships
            .filter((intern) => intern.name !== "All")
            .map((intern) => (
              <TableRow key={intern._id}>
                <TableCell>{intern.name}</TableCell>
                <TableCell>
                  {instructors.find((i) => i._id === intern.instructor)?.name ||
                    "—"}
                </TableCell>
                <TableCell>{intern.years?.join(", ") || "—"}</TableCell>
                <TableCell className="text-center">
                  <Button size="sm" onClick={() => onEdit(intern)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => onDelete(intern)}
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
