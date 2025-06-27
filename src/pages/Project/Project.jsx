import AwardsBar from "@/components/AwardsBar";
import Loader from "@/components/Loader/Loader";
import BackButton from "@/components/ui/BackButton";
import { useInstructors } from "@/hooks/useInstructors";
import { useInternships } from "@/hooks/useInternships";
import { useProjectById } from "@/hooks/useProjectsById";
import { useUserEmails } from "@/hooks/useUserEmails";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import ProjectMedia from "./ProjectMedia";

const Project = () => {
  const { id } = useParams();

  const { data: project, isLoading } = useProjectById(id);
  const { data: instructors } = useInstructors();
  const { data: internships } = useInternships();
  const { data: userList = [] } = useUserEmails();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    .filter(Boolean);

  if (isLoading || !project || !instructors || !internships) {
    return <Loader />;
  }

  return (
    <div className="mt-5 max-w-[90%] lg:max-w-[95%] mx-auto">
      <main className="container relative mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-3 py-4 border shadow-lg lg:flex lg:items-center lg:justify-between lg:gap-12 bg-white/30 backdrop-blur-md border-white/30 rounded-xl lg:pl-8 lg:px-0 lg:pr-2">
            <div className="lg:w-1/2">
              <img
                src={project?.image}
                alt={project?.name}
                className="rounded-xl object-contain mx-auto max-h-[500px] w-auto max-w-full shadow-xl border-[1px] border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-4 mt-4 lg:w-1/2 lg:mt-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold lg:text-5xl">
                    {project?.name}
                  </h1>
                  <Link
                    to={`/internships/${internshipObj?._id}`}
                    className="inline-block px-2 py-1 mt-2 mb-2 text-xs font-medium capitalize transition rounded-full w-fit hover:underline"
                    style={{
                      backgroundColor: `#${internshipObj?.backgroundColor}`,
                      color: `#${internshipObj?.textColor}`,
                    }}
                  >
                    {internshipObj?.name}
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
                    className="flex items-center gap-2 transition hover:underline hover:text-primary"
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
                <h2 className="mb-2 font-semibold">Members:</h2>
                <ul className="flex flex-col gap-3">
                  {projectMembers.map((user) => {
                    const image =
                      user.image && user.image !== ""
                        ? user.image
                        : "/images/default.jpg";

                    return (
                      <Link
                        to={`/users/${user._id}`}
                        className="text-sm text-primary"
                      >
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
                      </Link>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <ProjectMedia project={project} />

          <BackButton />
        </motion.div>
      </main>
    </div>
  );
};

export default Project;
