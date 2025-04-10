import { useParams } from "react-router";
import { useInstructors } from "@/hooks/useInstructors";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";

const InstructorProfile = () => {
  const { id } = useParams();
  const { data: instructors, isLoading, isError } = useInstructors();

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  const instructor = instructors.find((i) => i._id === id);

  if (!instructor) return <Error message="Instructor not found" />;

  const image =
    instructor.image && instructor.image !== ""
      ? instructor.image
      : "/images/default.jpg";

  return (
    <main className="mx-auto mt-5 px-5 max-w-2xl">
      <div className="flex flex-col items-center gap-4">
        <img
          src={image}
          alt={instructor.name}
          className="h-48 w-48 object-cover rounded-lg shadow-md"
        />
        <h1 className="text-2xl font-bold">{instructor.name}</h1>
        <p className="text-gray-700 whitespace-pre-line text-center">
          {instructor.description}
        </p>
      </div>
    </main>
  );
};

export default InstructorProfile;
