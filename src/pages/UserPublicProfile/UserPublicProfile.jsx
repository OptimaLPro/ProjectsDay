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
import { useEffect } from "react";

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: internships = [], isInternshipsLoading } = useInternships();

  if (isLoading || isInternshipsLoading) return <Loader />;
  if (isError || !user) return <Error message="User not found" />;

  const userInternship = internships.find((i) => i._id === user.internship);

  const image =
    user.image && user.image !== "" ? user.image : "/images/default.jpg";

  // Use email if first_name or last_name is null or empty
  const displayName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email;

  return (
    <main className="relative max-w-2xl px-5 mx-auto mt-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 border shadow-xl backdrop-blur-md bg-white/40 border-white/30">
          <div className="flex flex-col items-center gap-6">
            <img
              src={image}
              alt={displayName}
              className="object-cover w-48 h-48 border rounded-full shadow-md border-white/30"
            />
            <div className="flex flex-col items-center gap-2">
              <h1
                className={`font-bold text-center break-words ${
                  displayName === user.email
                    ? "text-xl sm:text-3xl" // קטן במובייל, גדול בדסקטופ
                    : "text-3xl"
                }`}
              >
                {displayName}
              </h1>

              {userInternship && (
                <Link
                  key={userInternship._id}
                  to={`/internships/${userInternship._id}`}
                  className="inline-block px-2 py-1 mt-2 mb-2 text-xs font-medium capitalize transition rounded-full w-fit hover:underline"
                  style={{
                    backgroundColor: `#${userInternship.backgroundColor}`,
                    color: `#${userInternship.textColor}`,
                  }}
                >
                  {userInternship.name}
                </Link>
              )}
            </div>
            {user.about && (
              <p className="max-w-xl text-center text-gray-700 whitespace-pre-line">
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
