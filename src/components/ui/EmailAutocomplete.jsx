import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import useAllProjects from "@/hooks/useAllProjects";

export default function EmailAutocomplete({ users, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { data: allProjects = [] } = useAllProjects();

  useEffect(() => {
    const assignedIds = new Set();
    for (const project of allProjects) {
      for (const memberId of project.members || []) {
        if (typeof memberId === "string") {
          assignedIds.add(memberId);
        } else if (typeof memberId === "object" && memberId?.$oid) {
          assignedIds.add(memberId.$oid);
        }
      }
    }

    const unassignedUsers = users.filter((user) => !assignedIds.has(user._id));
    setFilteredUsers(unassignedUsers);
  }, [users, allProjects]);

  const selectedUser = users.find((u) => u.email === value);

  const displayedUsers = filteredUsers.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder="Select email..."
          value={selectedUser?.email || search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            onChange(""); // reset selection
          }}
          onClick={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px] max-h-[300px] overflow-y-auto">
        <Command>
          <CommandInput
            placeholder="Search email..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            {displayedUsers.map((user) => (
              <CommandItem
                key={user._id}
                onSelect={() => {
                  onChange(user.email);
                  setSearch(user.email);
                  setOpen(false);
                }}
              >
                {user.email}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
