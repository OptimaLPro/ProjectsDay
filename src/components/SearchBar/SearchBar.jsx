import { Search } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Combobox } from "../ui/combobox";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  setActiveCategory,
  categories,
}) => {
  const handleTabChange = (value) => {
    if (value === "All") {
      setActiveCategory("All"); // Reset or handle "all" explicitly
    } else {
      setActiveCategory(value);
    }
  };

  return (
    <>
      <div className="relative lg:w-1/3 flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search..."
          className="pl-10 bg-[#ffffffc4]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="block lg:hidden relative ">
        <Combobox/>
      </div>
      <Tabs
        defaultValue="All"
        className="w-full lg:w-2/3 hidden lg:block"
        onValueChange={handleTabChange}
      >
        <TabsList className="w-full grid grid-cols-3 lg:grid-cols-7 relative">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-sm cursor-pointer capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
};

export default SearchBar;
