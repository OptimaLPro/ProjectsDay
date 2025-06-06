import { useParams } from "react-router";
import { useInstructorById } from "@/hooks/useInstructorById";
import { useInternships } from "@/hooks/useInternships";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import BackButton from "@/components/ui/BackButton";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import { motion } from "framer-motion";

const InstructorProfile = () => {
  const { id } = useParams();
  const { data: instructor, isLoading, isError } = useInstructorById(id);
  const { data: internships = [] } = useInternships();

  if (isLoading) return <Loader />;
  if (isError || !instructor) return <Error message="Instructor not found" />;

  const image =
    instructor.image && instructor.image !== ""
      ? instructor.image
      : "/images/default.jpg";

  const instructorInternships = Array.isArray(instructor.internships)
    ? instructor.internships
        .map((id) => internships.find((i) => i._id === id))
        .filter(Boolean)
    : [];

  return (
    <main className="relative max-w-2xl px-5 mx-auto mt-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 border shadow-xl backdrop-blur-md bg-white/40 border-white/30">
          <div className="flex flex-col items-center gap-4">
            <img
              src={image}
              alt={instructor.name}
              className="object-cover w-48 h-48 border rounded-full shadow-md border-white/30"
            />
            <h1 className="text-2xl font-bold">{instructor.name}</h1>

            <div className="mb-4 text-center">
              {instructorInternships.length > 0 ? (
                <ul className="flex flex-wrap justify-center gap-2">
                  {instructorInternships.map((internship) => (
                    <Link
                      key={internship._id}
                      to={`/internships/${internship._id}`}
                      className="inline-block px-2 py-1 mt-2 mb-2 text-xs font-medium capitalize transition rounded-full w-fit hover:underline"
                      style={{
                        backgroundColor: `#${internship.backgroundColor}`,
                        color: `#${internship.textColor}`,
                      }}
                    >
                      {internship.name}
                    </Link>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-gray-600">Other</span>
              )}
            </div>

            <p className="text-center text-gray-700 whitespace-pre-line">
              {instructor.description}
            </p>
          </div>
        </Card>
      </motion.div>
      <div className="mt-4">
        <BackButton />
      </div>
    </main>
  );
};

export default InstructorProfile;
