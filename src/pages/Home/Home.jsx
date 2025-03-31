import { categories } from "@/assets/CategoriesData";
import { projects } from "@/assets/ProjectsData";
import Cards from "@/components/Cards/Cards";
import NoFoundProjects from "@/components/NoFoundProjects/NoFoundProjects";
import SearchBar from "@/components/SearchBar/SearchBar";
import { filterProjects } from "@/utils/general";
import { useState } from "react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = filterProjects(
    projects,
    searchQuery,
    activeCategory
  );

  return (
    <>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-5 lg:px-4">
          <div className="flex lg:flex-row gap-3 lg:gap-6 mb-12 justify-between items-center">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setActiveCategory={setActiveCategory}
              categories={categories}
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
