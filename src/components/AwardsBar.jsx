import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  import { useState } from "react";
  
  const AwardsBar = ({ project, size = 60, openDialog = true }) => {
    const [selectedAward, setSelectedAward] = useState(null);
  
    if (!project.awards || project.awards.length === 0) return null;
  
    return (
      <>
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
                    onClick={() => {
                      if (openDialog) {
                        setSelectedAward(award);
                      }
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>{award.name}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
  
        {openDialog && selectedAward && (
          <Dialog open={true} onOpenChange={() => setSelectedAward(null)}>
            <DialogContent className="text-center flex flex-col items-center gap-4">
              <img
                src={selectedAward.image}
                alt={selectedAward.name}
                className="w-[100px] h-[100px] rounded-full border shadow-md"
              />
              <DialogHeader className="text-center">
                <DialogTitle className="text-xl text-center">{selectedAward.name}</DialogTitle>
                <DialogDescription className=" mt-2 whitespace-pre-line text-sm text-muted-foreground">
                  {selectedAward.description}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  };
  
  export default AwardsBar;
  