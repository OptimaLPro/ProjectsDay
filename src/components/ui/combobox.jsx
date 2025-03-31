import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

const  internships = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "data science",
    label: "Data Science",
  },
  {
    value: "nlp",
    label: "NLP",
  },
  {
    value: "fullstack",
    label: "Fullstack",
  },
  {
    value: "deep learning",
    label: "Deep Learning",
  },
  {
    value: "cyber",
    label: "Cyber",
  },
  {
    value: "fintech",
    label: "Fintech",
  },
];

export function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between bg-[#ffffffc4]"
        >
          {value
            ?  internships.find(( internship) =>  internship.value === value)?.label
            : "Filter"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select Internship" />
          <CommandList>
            <CommandEmpty>No internship found.</CommandEmpty>
            <CommandGroup>
              { internships.map(( internship) => (
                <CommandItem
                  key={ internship.value}
                  value={ internship.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value ===  internship.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  { internship.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
