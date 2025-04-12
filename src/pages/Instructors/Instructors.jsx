import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { useAuth } from "@/context/AuthContext";
import { useInstructors } from "@/hooks/useInstructors";
import { useInternships } from "@/hooks/useInternships";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const Instructors = () => {
  const { year, isLoadingYear } = useAuth();
  const { data: instructorsData, isLoading, isError } = useInstructors();
  const { data: internshipsData, isLoading: internshipsLoading } =
    useInternships();

  if (isLoading || internshipsLoading || isLoadingYear) return <Loader />;
  if (isError) return <Error />;

  const grouped = {};

  for (const instructor of instructorsData) {
    const internshipsForYear = (instructor.internships || []).filter(
      (internId) => {
        const internship = internshipsData.find((i) => i._id === internId);
        return internship && internship.years.includes(year);
      }
    );

    if (internshipsForYear.length === 0) continue;

    for (const internshipId of internshipsForYear) {
      if (!grouped[internshipId]) grouped[internshipId] = [];
      grouped[internshipId].push(instructor);
    }
  }

  const getInternshipNameById = (id) => {
    if (id === "Other") return "Other";

    const internshipByName = internshipsData.find((i) => i.name === id);
    if (internshipByName) return internshipByName.name;

    const internshipById = internshipsData.find((i) => i._id === id);
    return internshipById ? internshipById.name : id;
  };

  return (
    <main className="mx-auto mt-5 px-5 lg:px-4 max-w-[80%] relative">
      <h1 className="text-3xl font-bold text-center mb-10">Instructors</h1>

      {Object.entries(grouped).map(([internshipId, instructors], groupIdx) => (
        <div key={internshipId} className="mb-12">
          {groupIdx > 0 && <Separator className="my-8" />}
          <h2 className="text-2xl font-semibold mb-6">
            {getInternshipNameById(internshipId)}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {instructors.map((instructor, index) => (
              <motion.div
                key={instructor._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/instructors/${instructor._id}`}
                  className="cursor-pointer flex flex-col lg:items-center hover:scale-105 transition-transform duration-300"
                >
                  <Card className="p-6 shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border border-white/30 transition-all">
                    <img
                      src={instructor.image || "/images/default.jpg"}
                      alt={instructor.name}
                      className="lg:h-48 lg:w-48 w-[140px] h-[140px] object-cover rounded-full shadow-xl border border-white/30"
                    />
                    <div className="text-center mt-2 font-semibold text-lg flex items-center justify-center">
                      {instructor.name}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
};

export default Instructors;
