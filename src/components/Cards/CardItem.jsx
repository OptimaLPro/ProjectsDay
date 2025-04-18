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
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col py-0 gap-0 ">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
        
        <CardContent className="flex-grow pt-4 ">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="mt-2 w-fit inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2 capitalize">
                {internshipName}
              </div>
              <h3 className="font-bold text-xl">{project.name}</h3>
            </div>
            <AwardsBar project={project} openDialog={false} />
          </div>

          <p className="text-muted-foreground mt-2 text-sm">
            {project.short_description?.length > 199
              ? `${project.short_description.slice(0, 199)}...`
              : project.short_description}
          </p>
        </CardContent>

        <CardFooter className="pt-0 pb-4 mt-6 flex justify-end text-gray-400">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View Project <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardItem;
