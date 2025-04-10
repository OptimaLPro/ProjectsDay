import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { Card } from "@/components/ui/card";
import { useProjectById } from "@/hooks/useProjectsById";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useInstructors } from "@/hooks/useInstructors";
import { useUsersByEmails } from "@/hooks/useUsersByEmails";

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useProjectById(id);
  const { data: instructors } = useInstructors();
  const memberEmails = project?.members?.map((m) => m.email);
  const { data: users = [] } = useUsersByEmails(memberEmails);

  const instructorObj = instructors?.find(
    (i) => i.name === project?.instructor
  );

  const instructorImage =
    instructorObj?.image && instructorObj.image !== ""
      ? instructorObj.image
      : "/images/default.jpg";

  if (isLoading) {
    return <Loader />;
  }

  if (!project) {
    return <Error />;
  }

  return (
    <div className="bg-background mt-5 max-w-[90%] mx-auto">
      <main className="container mx-auto px-5 lg:px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="lg:flex lg:items-center lg:justify-between mb-12 lg:gap-12">
            <Card className="overflow-hidden transition-all border-0 duration-300 hover:shadow-xl shadow-xl h-full flex flex-col py-0 lg:w-1/2 relative">
              <img src={project?.image} alt={project?.name} />
            </Card>
            <div className="flex flex-col gap-4 mt-6 lg:w-1/2 lg:pl-6">
              <h1 className="text-2xl font-bold">{project?.name}</h1>
              <div className="w-fit mt-2 inline-block px-2 py-1 rounded-full text-xs  font-medium bg-primary/10 text-primary mb-2 capitalize">
                {project?.internship}
              </div>
              <p>{project?.description}</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Instructor:</p>
                  <Link
                    to={`/instructors/${instructorObj?._id}`}
                    className="flex items-center gap-2 hover:underline hover:text-primary transition"
                  >
                    <img
                      src={instructorImage}
                      alt={project?.instructor}
                      className="w-10 h-10 rounded-full object-cover shadow-lg border-[1px] border-gray-300"
                    />
                    <span>{project?.instructor}</span>
                  </Link>
                </div>
              </div>
              <div>
                <h2 className="font-semibold">Members:</h2>
                <ul className="flex flex-col gap-3">
                  {project?.members?.map((member, index) => {
                    const user = users.find((u) => u.email === member.email);
                    const image =
                      user?.image && user.image !== ""
                        ? user.image
                        : "/images/default.jpg";

                    return (
                      <li key={index} className="flex items-center gap-3">
                        <img
                          src={image}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover shadow-lg border-[1px] border-gray-300"
                        />
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({member.email})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <ArrowLeft
              onClick={() => navigate(-1)}
              className="mb-12 w-10 h-10 p-2 text-gray-600 bg-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-300 transition pointer duration-200 cursor-pointer"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Project;
