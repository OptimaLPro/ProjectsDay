import { useInstructors } from "@/hooks/useInstructors";
import { useInternships } from "@/hooks/useInternships";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function Internships() {
  const { data: internships, isLoading, isError } = useInternships();
  const { data: instructors } = useInstructors();

  if (isLoading || !internships || !instructors) return <Loader />;
  if (isError) return <Error />;

  const filteredInternships = internships.filter(
    (internship) => internship.name !== "All"
  );

  return (
    <main className="relative max-w-6xl px-5 mx-auto mt-5">
      <h1 className="mb-10 text-3xl font-bold text-center">Internships</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {filteredInternships.map((internship, index) => {
          const instructorObj = instructors.find(
            (i) => i._id === internship.instructor
          );

          const instructorImage =
            instructorObj?.image && instructorObj.image !== ""
              ? instructorObj.image
              : "/images/default.jpg";

          return (
            <motion.div
              key={internship._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/internships/${internship._id}`}>
                <Card className="p-6 transition-all duration-300 border shadow-xl hover:scale-105 hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
                  <h2 className="mb-2 text-2xl font-semibold">
                    {internship.name}
                  </h2>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={instructorImage}
                      alt={instructorObj?.name || "Instructor"}
                      className="object-cover w-12 h-12 border rounded-full shadow"
                    />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Head Instructor
                      </p>
                      <p>{instructorObj?.name || "Unknown"}</p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-justify text-gray-800 whitespace-pre-line">
                    {internship.description}
                  </p>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
