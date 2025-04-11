import { useEffect, useState, useRef } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import AddUserForm from "../AddUserForm/AddUserForm";
import EditUserDialog from "@/components/EditUserDialog/EditUserDialog";
import DeleteUserDialog from "@/components/DeleteUserDialog/DeleteUserDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AuthUsers() {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchInternship, setSearchInternship] = useState("");
  const fileInputRef = useRef(null);

  const fetchUsers = async () => {
    const res = await api.get("/auth/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      try {
        await api.post("/auth/bulk-register", json);
        fetchUsers();
        alert("Users uploaded successfully!");
      } catch (err) {
        console.error(err);
        alert("Error uploading users");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setDialogType("edit");
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDialogType("delete");
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setDialogType(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      user.internship.toLowerCase().includes(searchInternship.toLowerCase())
  );

  return (
    <div className="relative max-w-6xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Authorized Users</h1>

      <div className="flex gap-4 mb-4 justify-center">
        <Input
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="max-w-xs bg-white shadow-lg"
        />
        <Input
          placeholder="Search by internship"
          value={searchInternship}
          onChange={(e) => setSearchInternship(e.target.value)}
          className="max-w-xs bg-white shadow-lg"
        />
      </div>

      <div className="my-8 flex gap-4 justify-center items-center">
        <Button onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? "Cancel" : "Add Single User"}
        </Button>

        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Upload Users from Excel
        </Button>
        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          onChange={handleExcelUpload}
          className="hidden"
        />
      </div>

      {showAddForm && (
        <div className="my-8">
          <AddUserForm onSuccess={fetchUsers} />
        </div>
      )}

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
            {filteredUsers.map((user) => (
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
                <TableCell>{user.internship}</TableCell>
                <TableCell>{user.year}</TableCell>
                <TableCell className="text-center">
                  <Button size="sm" onClick={() => openEditDialog(user)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => openDeleteDialog(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {dialogType === "edit" && selectedUser && (
        <EditUserDialog
          user={selectedUser}
          onClose={closeDialog}
          onSave={fetchUsers}
        />
      )}

      {dialogType === "delete" && selectedUser && (
        <DeleteUserDialog
          user={selectedUser}
          onClose={closeDialog}
          onDelete={fetchUsers}
        />
      )}
    </div>
  );
}
