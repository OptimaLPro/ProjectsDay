import { getInternships } from "@/api/internships";
import { getProjects } from "@/api/projects";
import Cards from "@/components/Cards/Cards";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import NoFoundProjects from "@/components/NoFoundProjects/NoFoundProjects";
import SearchBar from "@/components/SearchBar/SearchBar";
import { filterProjects } from "@/utils/general";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeInternship, setActiveInternship] = useState("All");

  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError: projectError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 60 minutes
  });

  const {
    data: internshipsData,
    isLoading: internshipsLoading,
    isError: internshipError,
  } = useQuery({
    queryKey: ["internships"],
    queryFn: getInternships,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 60 minutes
  });

  if (projectsLoading || internshipsLoading) {
    return <Loader />;
  }

  if (projectError || internshipError) {
    return <Error />;
  }

  const filteredProjects = filterProjects(
    projectsData,
    searchQuery,
    activeInternship
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-5 lg:px-4">
        <div className="flex lg:flex-row gap-3 lg:gap-6 mb-12 justify-between items-center">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeInternship={activeInternship}
            setActiveInternship={setActiveInternship}
            internships={internshipsData}
          />
        </div>
        {filteredProjects.length === 0 ? (
          <NoFoundProjects />
        ) : (
          <Cards projects={filteredProjects} />
        )}
      </main>
    </div>
  );
};

export default Home;
