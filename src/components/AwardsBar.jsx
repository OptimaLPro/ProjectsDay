import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  
  const AwardsBar = ({ project, size = 60 }) => {
    if (!project.awards || project.awards.length === 0) return null;
  
    return (
      <div className="flex gap-1">
        <TooltipProvider>
          {project.awards.map((award) => (
            <Tooltip key={award._id}>
              <TooltipTrigger asChild>
                <img
                  src={award.image}
                  alt={award.name}
                  style={{ width: size, height: size }}
                  className="cursor-pointer transition-transform duration-300 hover:scale-105"
                />
              </TooltipTrigger>
              <TooltipContent>{award.name}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    );
  };
  
  export default AwardsBar;
  