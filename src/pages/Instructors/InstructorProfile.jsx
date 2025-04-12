import { useParams } from "react-router";
import { useInstructorById } from "@/hooks/useInstructorById";
import { useInternships } from "@/hooks/useInternships";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import BackButton from "@/components/ui/BackButton";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";

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

  // מציאת ההתמחויות לפי ה־ObjectId
  const instructorInternships = Array.isArray(instructor.internships)
    ? instructor.internships
        .map((id) => internships.find((i) => i._id === id))
        .filter(Boolean)
    : [];

  return (
    <main className="mx-auto mt-5 px-5 max-w-2xl relative">
      <Card className="p-6 backdrop-blur-md bg-white/40 border border-white/30 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <img
            src={image}
            alt={instructor.name}
            className="h-48 w-48 object-cover rounded-lg shadow-md"
          />
          <h1 className="text-2xl font-bold">{instructor.name}</h1>

          <div className="mb-4 text-center">
            {instructorInternships.length > 0 ? (
              <ul className="flex flex-wrap gap-2 justify-center">
                {instructorInternships.map((internship) => (
                  <Link
                    key={internship._id}
                    to={`/internships/${internship._id}`}
                    className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full hover:underline transition"
                  >
                    {internship.name}
                  </Link>
                ))}
              </ul>
            ) : (
              <span className="text-gray-600 text-sm">Other</span>
            )}
          </div>

          <p className="text-gray-700 whitespace-pre-line text-center">
            {instructor.description}
          </p>
        </div>
      </Card>

      <div className="mt-4">
        <BackButton />
      </div>
    </main>
  );
};

export default InstructorProfile;
