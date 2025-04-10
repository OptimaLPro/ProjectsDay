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

  const getInstructorImage = (name) => {
    const found = instructors?.find((i) => i.name === name);
    return found?.image && found.image !== ""
      ? found.image
      : "/images/default.jpg";
  };

  if (isLoading || !internships || !instructors) return <Loader />;
  if (isError) return <Error />;

  const filteredInternships = internships.filter(
    (internship) => internship.name !== "All"
  );

  return (
    <main className="max-w-6xl mx-auto mt-5 px-5 relative">
      <h1 className="text-3xl font-bold text-center mb-10">Internships</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {filteredInternships.map((internship, index) => (
          <motion.div
            key={internship._id || internship.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/internships/${internship._id}`}>
              <Card className="p-6 shadow-lg hover:shadow-xl transition-all">
                <h2 className="text-2xl font-semibold mb-2">
                  {internship.name}
                </h2>

                <Link
                  to={`/instructors/${
                    instructors.find((i) => i.name === internship.instructor)
                      ?._id
                  }`}
                  className="flex items-center gap-3 mb-4 hover:underline hover:text-primary transition"
                >
                  <img
                    src={getInstructorImage(internship.instructor)}
                    alt={internship.instructor}
                    className="w-12 h-12 object-cover rounded-full border shadow"
                  />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">
                      Instructor
                    </p>
                    <p>{internship.instructor}</p>
                  </div>
                </Link>

                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {internship.description}
                </p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
