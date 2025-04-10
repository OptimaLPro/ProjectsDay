import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useInstructors } from "@/hooks/useInstructors";
import { Link } from "react-router";

const Instructors = () => {
  const { isLoadingYear } = useAuth();

  const { data: instructorsData, isLoading, isError } = useInstructors();

  if (isLoading || isLoadingYear) {
    return <Loader />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <main className="mx-auto mt-5 px-5 lg:px-4 max-w-[90%]">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 relative">
        {instructorsData.map((instructor) => (
          <Link
            key={instructor._id}
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
        ))}
      </div>
    </main>
  );
};

export default Instructors;
