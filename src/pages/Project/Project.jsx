import React from "react";
import { useParams } from "react-router";
import { projects } from "@/assets/ProjectsData";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { StepBack } from "lucide-react";

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundProject = projects.find(
      (project) => project.id.toString() === id
    );
    if (!foundProject) {
      navigate("/404", { replace: true });
    } else {
      setProject(foundProject);
    }
  }, [id, navigate]);

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
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl shadow-lg h-full flex flex-col py-0 lg:w-1/2 relative">
              <img src={project?.image} alt={project?.name} />
            </Card>
            <div className="flex flex-col gap-4 mt-6 lg:w-1/2 lg:pl-6">
              <h1 className="text-2xl font-bold">{project?.name}</h1>
              <p>{project?.description}</p>
              <div className="flex gap-2">
                <p className="font-semibold">Instructor:</p>
                {project?.instructor}
              </div>
              <div>
                <h2 className="font-semibold">Members:</h2>
                <ul className="list-disc list-inside">
                  {project?.members?.map((member, index) => (
                    <li key={index}>
                      {member.name}{" "}
                      <span className="text-sm">({member.email})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <StepBack
            onClick={() => navigate(-1)}
            className="mb-12 w-10 h-10 p-2 text-gray-600 bg-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-300 transition"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Project;
