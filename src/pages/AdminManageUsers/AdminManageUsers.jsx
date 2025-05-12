import { useEffect, useState, useRef } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import AddUserForm from "./AddUserForm";
import EditUserDialog from "@/components/EditUserDialog/EditUserDialog";
import DeleteUserDialog from "@/components/DeleteUserDialog/DeleteUserDialog";
import AdminManageUsersTable from "./AdminManageUsersTable";
import { useInternships } from "@/hooks/useInternships";
import { Combobox } from "@/components/ui/combobox";
import ToastMessage from "@/components/ui/ToastMessage";
import { useYearbooks } from "@/hooks/useYearbooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminDeleteUsersDialog from "./AdminDeleteUsersDialog";

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchInternship, setSearchInternship] = useState("All");

  const fileInputRef = useRef(null);

  const { data: internships = [] } = useInternships();
  const { data: yearbooks = [] } = useYearbooks();
  const [searchYearbook, setSearchYearbook] = useState("All");

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
        // Map internship names to their IDs
        const usersWithInternshipIds = json.map((user) => {
          const internship = internships.find(
            (i) => i.name === user.internship
          );
          return {
            ...user,
            internship: internship ? internship._id : null,
          };
        });

        const response = await api.post(
          "/auth/bulk-register",
          usersWithInternshipIds
        );
        const results = response.data;

        // Show detailed results to the user
        let message = "Upload Results:\n";
        if (results.created.length > 0) {
          message += `\nSuccessfully created ${results.created.length} users:\n`;
          ToastMessage({
            type: "success",
            message: `Successfully created ${results.created.length} users`,
          });
          results.created.forEach((user) => (message += `- ${user.email}\n`));
        }
        if (results.skipped.length > 0) {
          message += `\nSkipped ${results.skipped.length} users (already exist):\n`;
          ToastMessage({
            type: "info",
            message: `Skipped ${results.skipped.length} users (already exist)`,
          });
          results.skipped.forEach((user) => (message += `- ${user.email}\n`));
        }
        if (results.errors.length > 0) {
          message += `\nErrors for ${results.errors.length} users:\n`;
          ToastMessage({
            type: "error",
            message: `Errors for ${results.errors.length} users`,
          });
          results.errors.forEach(
            (error) => (message += `- ${error.email}: ${error.error}\n`)
          );
        }

        console.log("Upload Results:", results);
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Error uploading users. Please check the console for details.");
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

  const filteredUsers = users.filter((user) => {
    const internshipName =
      internships.find((i) => i._id === user.internship)?.name || "";

    const matchesEmail = user.email
      .toLowerCase()
      .includes(searchEmail.toLowerCase());

    const matchesInternship =
      searchInternship === "All" ||
      internshipName.toLowerCase().includes(searchInternship.toLowerCase());

    const matchesYearbook =
      searchYearbook === "All" || String(user.year) === searchYearbook;

    return matchesEmail && matchesInternship && matchesYearbook;
  });

  return (
    <div className="relative max-w-6xl mx-auto mt-10">
      <h1 className="mb-6 text-2xl font-bold text-center">Authorized Users</h1>

      <div className="flex justify-center gap-4 mb-4">
        <Input
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="max-w-xs bg-white shadow-lg"
        />
        <Combobox
          internships={internships}
          activeInternship={searchInternship}
          setActiveInternship={setSearchInternship}
          hideAwarded={true}
        />

        <Select
          value={searchYearbook}
          onValueChange={(val) => setSearchYearbook(val)}
        >
          <SelectTrigger className="w-40 bg-white shadow-lg">
            <SelectValue placeholder="Filter by yearbook" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Years</SelectItem>
            {yearbooks.map((yb) => (
              <SelectItem key={yb._id} value={yb.year.toString()}>
                {yb.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AdminDeleteUsersDialog onSuccess={fetchUsers} />
      </div>

      <div className="flex items-center justify-center gap-4 my-8">
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

        <Button
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/authusers-new.xlsx";
            link.download = "authusers-new.xlsx";
            link.click();
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1">
                  <div>
                    <Info />
                  </div>
                  <div>Excel Template</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="rtl">
                  כדי להוסיף כמות של משתמשים בו זמנית בעזרת קובץ Excel יש להשתמש
                  בתבנית הזאת. לחץ.י להורדה
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </div>

      {showAddForm && (
        <div className="my-8">
          <AddUserForm onSuccess={fetchUsers} />
        </div>
      )}

      <AdminManageUsersTable
        users={filteredUsers}
        internships={internships}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

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
