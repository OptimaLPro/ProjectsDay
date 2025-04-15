import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Github, Globe, Linkedin } from "lucide-react";
import api from "@/api/api";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import { useInternships } from "@/hooks/useInternships";

const UserPublicProfile = () => {
  const { id } = useParams();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: async () => {
      const res = await api.get(`/auth/users/${id}`);
      return res.data;
    },
  });

  const { data: internships = [], isInternshipsLoading } = useInternships();

  if (isLoading || isInternshipsLoading) return <Loader />;
  if (isError || !user) return <Error message="User not found" />;

  const userInternship = internships.find((i) => i._id === user.internship);

  const image =
    user.image && user.image !== "" ? user.image : "/images/default.jpg";

  return (
    <main className="mx-auto mt-5 px-5 max-w-2xl relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 backdrop-blur-md bg-white/40 border border-white/30 shadow-xl">
          <div className="flex flex-col items-center gap-6">
            <img
              src={image}
              alt={`${user.first_name} ${user.last_name}`}
              className="h-48 w-48 object-cover rounded-full shadow-md border border-white/30"
            />
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-bold text-center">
                {user.first_name} {user.last_name}
              </h1>
              {userInternship && (
                <Link
                  to={`/internships/${userInternship._id}`}
                  className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full hover:underline transition"
                >
                  {userInternship.name}
                </Link>
              )}
            </div>
            {user.about && (
              <p className="text-gray-700 whitespace-pre-line text-center max-w-xl">
                {user.about}
              </p>
            )}
            <div className="flex gap-5 mt-4">
              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {user.github && (
                <a href={user.github} target="_blank" rel="noopener noreferrer">
                  <Github size={24} />
                </a>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe size={24} />
                </a>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
      <div className="mt-4">
        <BackButton />
      </div>
    </main>
  );
};

export default UserPublicProfile;
