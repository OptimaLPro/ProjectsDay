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

export default function AdminManageUsersTable({
  users,
  internships,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-md bg-white border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Image</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Internship</TableHead>
            <TableHead>Year</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="text-center">
                <img
                  src={user.image || "/images/default.jpg"}
                  alt={user.email}
                  className="w-10 h-10 rounded-full object-cover mx-auto"
                />
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {internships.find((i) => i._id === user.internship)?.name ||
                  "N/A"}
              </TableCell>
              <TableCell>{user.year}</TableCell>
              <TableCell className="text-center">
                <Button size="sm" onClick={() => onEdit(user)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="ml-2"
                  onClick={() => onDelete(user)}
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
