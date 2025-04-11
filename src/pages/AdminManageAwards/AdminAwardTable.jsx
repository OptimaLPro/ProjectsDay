import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  
  export default function AdminAwardTable({ awards, onEdit, onDelete }) {
    return (
      <div className="rounded-md bg-white border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awards.map((award) => (
              <TableRow key={award._id}>
                <TableCell>
                  <img
                    src={award.image}
                    alt={award.name}
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                </TableCell>
                <TableCell>{award.name}</TableCell>
                <TableCell className="max-w-[250px] truncate">
                  {award.description}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onClick={() => onEdit(award)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => onDelete(award)}
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
  