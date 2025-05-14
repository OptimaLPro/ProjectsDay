import { ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import AwardsBar from "../AwardsBar";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useInternships } from "@/hooks/useInternships";

const CardItem = ({ project }) => {
  const { data: internships = [] } = useInternships();

  const internshipObj = internships.find(
    (i) => i._id === project.internship || i._id?.$oid === project.internship
  );

  const internshipName = internshipObj?.name || "Unknown";

  return (
    <Link to={`/projects/${project._id}`} className="group">
      <Card className="flex flex-col h-full gap-0 py-0 overflow-hidden transition-all duration-300 hover:shadow-lg ">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100" />
          <div className="absolute p-2 transition-opacity duration-300 rounded-full opacity-0 bottom-3 right-3 bg-primary text-primary-foreground group-hover:opacity-100">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <CardContent className="flex-grow pt-4 ">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div
                className="inline-block px-2 py-1 mt-2 mb-2 text-xs font-medium capitalize transition rounded-full w-fit hover:underline"
                style={{
                  backgroundColor: `#${internshipObj?.backgroundColor}`,
                  color: `#${internshipObj?.textColor}`,
                }}
              >
                {internshipName}
              </div>
              <h3 className="text-xl font-bold">{project.name}</h3>
            </div>
            <AwardsBar project={project} openDialog={false} />
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {project.short_description?.length > 199
              ? `${project.short_description.slice(0, 199)}...`
              : project.short_description}
          </p>
        </CardContent>

        <CardFooter className="flex justify-end pt-0 pb-4 mt-6 text-gray-400">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View Project <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardItem;
