import Cards from "@/components/Cards/Cards";
import Error from "@/components/Error/Error";
import InPlaceLoader from "@/components/Loader/InPlaceLoader";
import Loader from "@/components/Loader/Loader";
import NoFoundProjects from "@/components/NoFoundProjects/NoFoundProjects";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useInternships } from "@/hooks/useInternships";
import { useProjects } from "@/hooks/useProjects";
import { motion } from "framer-motion";
import { SeparatorHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "use-debounce";
import Hero from "./Hero/Hero";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeInternship, setActiveInternship] = useState("All");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);
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
  } = useProjects(debouncedSearchQuery, activeInternship);

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

  // const filteredProjects = filterProjects(
  //   allProjects,
  //   searchQuery,
  //   activeInternship,
  //   internshipsData
  // );

  return (
    <div className="min-h-screen">
      <main className="container px-5 mx-auto lg:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Hero />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex items-center justify-between gap-3 mb-12 lg:flex-row lg:gap-6"
        >
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeInternship={activeInternship}
            setActiveInternship={setActiveInternship}
            internships={internshipsData}
          />
        </motion.div>

        {allProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <NoFoundProjects />
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              <Cards projects={allProjects} />
            </motion.div>

            <motion.div
              ref={ref}
              className="py-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              {isFetchingNextPage ? (
                <Loader />
              ) : hasNextPage ? (
                <InPlaceLoader />
              ) : (
                <div className="flex items-center justify-center mx-auto text-gray-400">
                  <SeparatorHorizontal className="w-8 h-8" />
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
