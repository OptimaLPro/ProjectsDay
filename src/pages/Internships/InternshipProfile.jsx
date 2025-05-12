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

  const otherInstructors = instructors.filter(
    (inst) =>
      inst._id !== instructor?._id &&
      Array.isArray(inst.internships) &&
      inst.internships.includes(internship._id)
  );

  return (
    <main className="relative max-w-3xl px-6 mx-auto mt-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 border shadow-xl backdrop-blur-md bg-white/40 border-white/30">
          <h1 className="mb-6 text-4xl font-bold text-center">
            {internship.name}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <img
              src={instructorImage}
              alt={instructor?.name || "Instructor"}
              className="object-cover border rounded-full shadow w-14 h-14"
            />
            <div className="text-left">
              <p className="mb-1 text-sm text-muted-foreground">
                Head Instructor
              </p>
              <Link
                to={`/instructors/${instructor?._id}`}
                className="font-medium text-primary hover:underline"
              >
                {instructor?.name || "Unknown"}
              </Link>
            </div>
          </div>

          <p className="leading-relaxed text-justify text-gray-800 whitespace-pre-line">
            {internship.description}
          </p>

          {otherInstructors.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-10 text-2xl font-semibold text-center">
                Additional Instructors
              </h2>
<div className="flex flex-wrap justify-center gap-6">
                {otherInstructors.map((instructor) => (
                  <Link
                    key={instructor._id}
                    to={`/instructors/${instructor._id}`}
                    className="flex flex-col items-center transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={instructor.image || "/images/default.jpg"}
                      alt={instructor.name}
                      className="object-cover w-24 h-24 rounded-full shadow"
                    />
                    <p className="mt-2 font-medium text-center">
                      {instructor.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>
      <div className="mt-4">
        <BackButton />
      </div>
    </main>
  );
}
