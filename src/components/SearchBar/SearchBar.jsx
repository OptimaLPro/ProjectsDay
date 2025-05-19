import { Search, Trophy, X } from "lucide-react";
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
      <div className="relative flex-1 lg:w-1/2 xl:w-1/3">
        <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-10 bg-[#ffffffc4] shadow-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <X
          className="absolute w-6 h-6 text-gray-500 transition-all duration-200 -translate-y-1/2 right-3 top-1/2 opacity-70 hover:opacity-100"
          onClick={() => {
            setSearchQuery("");
            setActiveInternship("All");
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="relative block lg:w-1/2 xl:hidden ">
        <Combobox
          internships={internships}
          activeInternship={activeInternship}
          setActiveInternship={setActiveInternship}
        />
      </div>
      <Tabs
        value={activeInternship}
        className="hidden w-full lg:w-1/2 xl:w-2/3 xl:block"
        onValueChange={handleTabChange}
      >
        <TabsList
          className="relative grid w-full"
          style={{
            gridTemplateColumns: `${internships
              .map(() => "1fr")
              .join(" ")} 0.5fr`,
          }}
        >
          {internships.map((internship) => (
            <TabsTrigger
              key={internship.name}
              value={internship.name}
              className="text-sm capitalize cursor-pointer"
            >
              {internship.name}
            </TabsTrigger>
          ))}

          <TabsTrigger value="awarded" className="text-sm cursor-pointer ">
            <Trophy className="w-4 h-4 mr-2" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

export default SearchBar;
