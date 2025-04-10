import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { useAuth } from "@/context/AuthContext";
import { useInstructors } from "@/hooks/useInstructors";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { motion } from "framer-motion";

const Instructors = () => {
  const { isLoadingYear } = useAuth();
  const { data: instructorsData, isLoading, isError } = useInstructors();

  if (isLoading || isLoadingYear) return <Loader />;
  if (isError) return <Error />;

  const grouped = {};

  for (const instructor of instructorsData) {
    const keys = instructor.internships?.length
      ? instructor.internships
      : ["Other"];
    for (const key of keys) {
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(instructor);
    }
  }

  return (
    <main className="mx-auto mt-5 px-5 lg:px-4 max-w-[80%] relative">
      <h1 className="text-3xl font-bold text-center mb-10">Instructors</h1>

      {Object.entries(grouped).map(
        ([internshipName, instructors], groupIdx) => (
          <div key={internshipName} className="mb-12">
            {groupIdx > 0 && <Separator className="my-8" />}
            <h2 className="text-xl font-semibold mb-6">{internshipName}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {instructors.map((instructor, index) => (
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
          </div>
        )
      )}
    </main>
  );
};

export default Instructors;
