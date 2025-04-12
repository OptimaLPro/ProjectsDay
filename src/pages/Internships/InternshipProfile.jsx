import { useParams, Link } from "react-router";
import { useInternships } from "@/hooks/useInternships";
import { useInstructors } from "@/hooks/useInstructors";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import BackButton from "@/components/ui/BackButton";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function InternshipProfile() {
  const { id } = useParams();
  const { data: internships, isLoading, isError } = useInternships();
  const { data: instructors } = useInstructors();

  if (isLoading || !internships || !instructors) return <Loader />;
  if (isError) return <Error />;

  const internship = internships.find((i) => i._id === id);
  if (!internship) return <Error message="Internship not found" />;

  const instructor = instructors.find((i) => i._id === internship.instructor);
  const instructorImage =
    instructor?.image && instructor.image !== ""
      ? instructor.image
      : "/images/default.jpg";

  return (
    <main className="max-w-3xl mx-auto mt-12 px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl p-6">
          <h1 className="text-4xl font-bold text-center mb-6">
            {internship.name}
          </h1>
          <div className="flex items-center gap-4 mb-8 justify-center">
            <img
              src={instructorImage}
              alt={instructor?.name || "Instructor"}
              className="w-14 h-14 object-cover rounded-full border shadow"
            />
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-1">
                Head Instructor
              </p>
              <Link
                to={`/instructors/${instructor?._id}`}
                className="text-primary font-medium hover:underline"
              >
                {instructor?.name || "Unknown"}
              </Link>
            </div>
          </div>

          <p className="text-gray-800 whitespace-pre-line text-justify leading-relaxed">
            {internship.description}
          </p>
        </Card>
      </motion.div>
      <div className="mt-4">
        <BackButton />
      </div>
    </main>
  );
}
