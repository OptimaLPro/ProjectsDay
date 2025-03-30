import { ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

const CardItem = ({ project }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col py-0">
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
      <CardContent className="flex-grow pt-4">
        <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
          {project.category}
        </div>
        <h3 className="font-bold text-xl">{project.name}</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {project.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          View Project <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
