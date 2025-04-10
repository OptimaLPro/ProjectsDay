import { useParams, Link } from "react-router";
import { useInternships } from "@/hooks/useInternships";
import { useInstructors } from "@/hooks/useInstructors";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import BackButton from "@/components/ui/BackButton";

export default function InternshipProfile() {
  const { id } = useParams();
  const { data: internships, isLoading, isError } = useInternships();
  const { data: instructors } = useInstructors();

  if (isLoading || !internships || !instructors) return <Loader />;
  if (isError) return <Error />;

  const internship = internships.find((i) => i._id === id);
  if (!internship) return <Error message="Internship not found" />;

  const instructor = instructors.find((i) => i.name === internship.instructor);
  const instructorImage =
    instructor?.image && instructor.image !== ""
      ? instructor.image
      : "/images/default.jpg";

  return (
    <main className="max-w-3xl mx-auto mt-12 px-6 relative">
      <h1 className="text-4xl font-bold text-center mb-6">{internship.name}</h1>

      <div className="flex items-center gap-4 mb-8 justify-center">
        <img
          src={instructorImage}
          alt={internship.instructor}
          className="w-14 h-14 object-cover rounded-full border shadow"
        />
        <div className="text-left">
          <p className="text-sm text-muted-foreground mb-1">Instructor</p>
          <Link
            to={`/instructors/${instructor?._id}`}
            className="text-primary font-medium hover:underline"
          >
            {internship.instructor}
          </Link>
        </div>
      </div>

      <p className="text-gray-800 whitespace-pre-line text-justify leading-relaxed">
        {internship.description}
      </p>
      <BackButton />
    </main>
  );
}
