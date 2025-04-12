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
    <main className="max-w-6xl mx-auto mt-5 px-5 relative">
      <h1 className="text-3xl font-bold text-center mb-10">Internships</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
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
                <Card className="p-6 shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border border-white/30 transition-all">
                  <h2 className="text-2xl font-semibold mb-2">
                    {internship.name}
                  </h2>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={instructorImage}
                      alt={instructorObj?.name || "Instructor"}
                      className="w-12 h-12 object-cover rounded-full border shadow"
                    />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        Instructor
                      </p>
                      <p>{instructorObj?.name || "Unknown"}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 whitespace-pre-line text-justify leading-relaxed">
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
