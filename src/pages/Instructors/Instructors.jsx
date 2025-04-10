import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { useAuth } from "@/context/AuthContext";
import { useInstructors } from "@/hooks/useInstructors";
import { Link } from "react-router";
import { motion } from "framer-motion";

const Instructors = () => {
  const { isLoadingYear } = useAuth();
  const { data: instructorsData, isLoading, isError } = useInstructors();

  if (isLoading || isLoadingYear) return <Loader />;
  if (isError) return <Error />;

  return (
    <main className="mx-auto mt-5 px-5 lg:px-4 max-w-[80%]">
      <h1 className="text-3xl font-bold text-center mb-10">Instructors</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 relative">
        {instructorsData.map((instructor, index) => (
          <motion.div
            key={instructor._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/instructors/${instructor._id}`}
              className="cursor-pointer flex flex-col lg:items-center"
            >
              <img
                src={instructor.image || "/images/default.jpg"}
                alt={instructor.name}
                className="h-48 w-48 object-cover rounded-lg shadow-md"
              />
              <div className="text-center mt-2 font-semibold text-lg flex items-center justify-center">
                {instructor.name}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default Instructors;
