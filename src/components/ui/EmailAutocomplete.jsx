import { useState } from "react";
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

export default function EmailAutocomplete({ users, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const selectedUser = users.find((u) => u._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder="Select email..."
          value={selectedUser?.email || ""}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            onChange(""); // reset selection
          }}
          onClick={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandInput
            placeholder="Search email..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            {filtered.map((user) => (
              <CommandItem
                key={user._id}
                onSelect={() => {
                  onChange(user._id);
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
