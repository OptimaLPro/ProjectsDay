import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip_footer";
import { Button } from "../ui/button";

const ContributorsData = [
  {
    name: "Nati Forish",
    image:
      "https://res.cloudinary.com/dwgbi63rq/image/upload/v1747240065/Me_-_Copy_nlkvtt.jpg",
    link: "https://github.com/OptimaLPro",
  },
];

const Footer = () => {
  return (
    <footer className="py-4 text-zinc-700">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img className="h-4 opacity-80" src={"./ColmanDevClub Favicon.png"} />
          <p>{new Date().getFullYear()} ColmanDevClub</p>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div>Contributors:</div>
          <div>
            {ContributorsData.map((contributor) => (
              <TooltipProvider key={contributor.name}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="link" className="p-0">
                      <img
                        className="w-6 h-6 rounded-full"
                        src={contributor.image}
                        alt={contributor.name}
                        onClick={() =>
                          window.open(
                            contributor.link,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{contributor.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
