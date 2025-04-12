import AwardsBar from "@/components/AwardsBar";
import Loader from "@/components/Loader/Loader";
import BackButton from "@/components/ui/BackButton";
import { Card } from "@/components/ui/card";
import { useInstructors } from "@/hooks/useInstructors";
import { useInternships } from "@/hooks/useInternships";
import { useProjectById } from "@/hooks/useProjectsById";
import { useUsersByEmails } from "@/hooks/useUsersByEmails";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router";
import ProjectMedia from "./ProjectMedia";
import { useUserEmails } from "@/hooks/useUserEmails";

const Project = () => {
  const { id } = useParams();

  const { data: project, isLoading } = useProjectById(id);
  const { data: instructors } = useInstructors();
  const { data: internships } = useInternships();
  const { data: userList = [] } = useUserEmails();
  const memberEmails = project?.members?.map((m) => m.email);
  const { data: users = [] } = useUsersByEmails(memberEmails);

  const instructorObj = instructors?.find(
    (i) => i._id === project?.instructor || i._id?.$oid === project?.instructor
  );

  const internshipObj = internships?.find(
    (i) => i._id === project?.internship || i._id?.$oid === project?.internship
  );

  const instructorImage =
    instructorObj?.image && instructorObj.image !== ""
      ? instructorObj.image
      : "/images/default.jpg";

  const projectMembers = project?.members
    .map((memberId) => {
      const idStr =
        typeof memberId === "string"
          ? memberId
          : memberId?.$oid || memberId?.toString();
      return userList.find((user) => user._id === idStr);
    })
    .filter(Boolean); // הסרה של null במקרה שלא נמצא

  if (isLoading || !project || !instructors || !internships) {
    return <Loader />;
  }

  return (
    <div className="mt-5 max-w-[90%] lg:max-w-[95%] mx-auto">
      <main className="container mx-auto  relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="lg:flex lg:items-center lg:justify-between lg:gap-12  bg-white/30 backdrop-blur-md border border-white/30 rounded-xl shadow-lg py-4 lg:pl-8 px-3 lg:px-0 lg:pr-2">
            <Card className="overflow-hidden transition-all border-0 duration-300 hover:shadow-xl shadow-xl h-full flex flex-col py-0 lg:w-1/2 relative ">
              <img src={project?.image} alt={project?.name} />
            </Card>

            <div className="flex flex-col gap-4 lg:w-1/2  lg:mt-0 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">{project?.name}</h1>
                  <Link
                    to={`/internships/${internshipObj?._id}`}
                    className="w-fit mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2 capitalize hover:underline transition"
                  >
                    <span>{internshipObj?.name}</span>
                  </Link>
                </div>
                <div>
                  <AwardsBar project={project} size={70} />
                </div>
              </div>
              <p className="font-semibold">{project?.short_description}</p>
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
                    <span>{instructorObj?.name}</span>
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="font-semibold">Members:</h2>
                <ul className="flex flex-col gap-3">
                  {projectMembers.map((user) => {
                    const image =
                      user.image && user.image !== ""
                        ? user.image
                        : "/images/default.jpg";

                    return (
                      <li key={user._id} className="flex items-center gap-3">
                        <img
                          src={image}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover shadow-lg border-[1px] border-gray-300"
                        />
                        <span className="font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({user.email})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {(project?.youtube || project?.gallery?.length > 0) && (
            <ProjectMedia project={project} />
          )}

          <BackButton />
        </motion.div>
      </main>
    </div>
  );
};

export default Project;
