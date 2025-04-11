import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  
  export default function AdminInstructorTable({ instructors, onEdit, onDelete }) {
    return (
      <div className="rounded-md border bg-white mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Years</TableHead>
              <TableHead>Internships</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.map((instructor) => {
              const filteredInternships =
                instructor.internships?.filter((i) => i !== "All") || [];
  
              return (
                <TableRow key={instructor._id}>
                  <TableCell className="text-center">
                    <img
                      src={instructor.image || "/images/default.jpg"}
                      alt={instructor.name}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                  </TableCell>
                  <TableCell>{instructor.name}</TableCell>
                  <TableCell>{instructor.years?.join(", ") || "—"}</TableCell>
                  <TableCell>{filteredInternships.join(", ") || "—"}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      onClick={() => onEdit(instructor)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(instructor)}
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
  