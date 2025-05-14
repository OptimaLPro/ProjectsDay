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
import { Palette } from "lucide-react";

export default function AdminInternshipsTable({
  internships,
  instructors,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
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
                <TableCell>
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{
                      backgroundColor: `#${intern.backgroundColor}`,
                      color: `#${intern.textColor}`,
                    }}
                  >
                    <Palette size={16} />
                  </div>
                </TableCell>
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
