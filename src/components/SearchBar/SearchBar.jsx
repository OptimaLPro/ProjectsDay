import { Search } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const SearchBar = ({ searchQuery, setSearchQuery, setActiveCategory, categories }) => {
  
  return (
    <>
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search projects..."
          className="pl-10 bg-[#ffffffc4]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Tabs
        defaultValue="All"
        className="w-full md:w-2/3 h-5"
        onValueChange={setActiveCategory}
      >
        <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 relative ">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-sm cursor-pointer "
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
