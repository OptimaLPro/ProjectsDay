import { internships } from "@/assets/InternshipsData";
import { projects } from "@/assets/ProjectsData";
import Cards from "@/components/Cards/Cards";
import NoFoundProjects from "@/components/NoFoundProjects/NoFoundProjects";
import SearchBar from "@/components/SearchBar/SearchBar";
import { filterProjects } from "@/utils/general";
import { useState } from "react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeInternship, setActiveInternship] = useState("All");

  const filteredProjects = filterProjects(
    projects,
    searchQuery,
    activeInternship
  );

  return (
    <>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-5 lg:px-4">
          <div className="flex lg:flex-row gap-3 lg:gap-6 mb-6 justify-between items-center p-1">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeInternship={activeInternship}
              setActiveInternship={setActiveInternship}
              internships={internships}
            />
          </div>
          {filteredProjects.length === 0 ? (
            <NoFoundProjects />
          ) : (
            <Cards filteredProjects={filteredProjects} />
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
