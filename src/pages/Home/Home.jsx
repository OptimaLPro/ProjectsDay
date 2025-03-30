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
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-6 mb-10">
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
