import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function Combobox({
  internships,
  activeInternship,
  setActiveInternship,
  hideAwarded = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(activeInternship);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-gray-600 bg-white shadow-md w-fit"
        >
          {activeInternship || "Filter"}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select Internship" />
          <CommandList>
            <CommandEmpty>No internship found.</CommandEmpty>
            <CommandGroup>
              {internships.map((internship) => (
                <CommandItem
                  key={internship.name}
                  value={internship.name}
                  onSelect={(currentValue) => {
                    setActiveInternship(currentValue);
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === internship.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {internship.name}
                </CommandItem>
              ))}

              {/* 🏆 Awarded Projects option */}
              {!hideAwarded && (
                <CommandItem
                  value="awarded"
                  onSelect={() => {
                    setActiveInternship("awarded");
                    setValue("awarded");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "awarded" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  🏆 Awarded
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
