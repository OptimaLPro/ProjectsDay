import Cards from "@/components/Cards/Cards";
import Error from "@/components/Error/Error";
import InPlaceLoader from "@/components/Loader/InPlaceLoader";
import Loader from "@/components/Loader/Loader";
import NoFoundProjects from "@/components/NoFoundProjects/NoFoundProjects";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useInternships } from "@/hooks/useInternships";
import { useProjects } from "@/hooks/useProjects";
import { filterProjects } from "@/lib/general";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeInternship, setActiveInternship] = useState("All");
  const { isLoadingYear } = useAuth();

  const {
    data: internshipsData,
    isLoading: internshipsLoading,
    isError: internshipError,
  } = useInternships();

  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError: projectError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProjects();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoadingYear || projectsLoading || internshipsLoading) {
    return <Loader />;
  }

  if (projectError || internshipError) {
    return <Error />;
  }

  const allProjects = projectsData.pages.flatMap((page) => page.projects);

  const filteredProjects = filterProjects(
    allProjects,
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
          <>
            <Cards projects={filteredProjects} />
            <div ref={ref} className="py-4 text-center">
              {isFetchingNextPage ? (
                <Loader />
              ) : hasNextPage ? (
                <InPlaceLoader />
              ) : (
                <div className="text-gray-400">The End</div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
