import { Search, X } from "lucide-react";
import { Combobox } from "../ui/combobox";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  activeInternship,
  setActiveInternship,
  internships,
}) => {
  const handleTabChange = (value) => {
    if (value === "All") {
      setActiveInternship("All");
    } else {
      setActiveInternship(value);
    }
  };

  return (
    <>
      <div className="relative lg:w-1/3 flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search..."
          className="pl-10 bg-[#ffffffc4] shadow-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <X
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-6 w-6 opacity-70 hover:opacity-100 transition-all duration-200"
          onClick={() => {
            setSearchQuery("");
            setActiveInternship("All");
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="block lg:hidden relative ">
        <Combobox
          internships={internships}
          activeInternship={activeInternship}
          setActiveInternship={setActiveInternship}
        />
      </div>
      <Tabs
        value={activeInternship}
        className="w-full lg:w-2/3 hidden lg:block"
        onValueChange={handleTabChange}
      >
        <TabsList
          className="w-full grid relative"
          style={{
            gridTemplateColumns: `repeat(${internships.length}, minmax(0, 1fr))`,
          }}
        >
          {internships.map((internship) => (
            <TabsTrigger
              key={internship.name}
              value={internship.name}
              className="text-sm cursor-pointer capitalize"
            >
              {internship.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
};

export default SearchBar;
