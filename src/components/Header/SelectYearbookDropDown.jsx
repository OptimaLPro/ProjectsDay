import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useYearbooks } from "@/hooks/useYearbooks";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function SelectYearbookDropDown() {
  const { year } = useAuth();
  const [position, setPosition] = useState(year);

  const { data: yearbooks, isLoading, isError } = useYearbooks();
  const { setYear } = useAuth();

  const handleYearbookChange = (year) => {
    setYear(year);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <div className="opacity-30 p-[2px] bg-gray-400 rounded-full cursor-pointer">
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Yearbook</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {yearbooks?.map((yearbook) => (
            <DropdownMenuRadioItem
              key={yearbook._id}
              value={yearbook.year}
              onClick={() => handleYearbookChange(yearbook.year)}
            >
              {yearbook.year}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
