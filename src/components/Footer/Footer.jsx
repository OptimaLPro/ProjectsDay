import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip_footer";
import { Button } from "../ui/button";
import { Link } from "react-router";

const ContributorsData = [
  {
    name: "Nati Forish",
    id: "68176b867c9b5972730731c6",
    image:
      "https://res.cloudinary.com/dwgbi63rq/image/upload/v1747240065/Me_-_Copy_nlkvtt.jpg",
    link: "https://graduationday.vercel.app/users/68176b867c9b5972730731c6",
  },
];

const Footer = () => {
  return (
    <footer className="py-4 text-zinc-700">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            className="h-4 opacity-80"
            src={
              "https://res.cloudinary.com/dwgbi63rq/image/upload/v1747258721/ColmanDevClub_Favicon_olici1.png"
            }
          />
          <p>
            <a
              href="https://colmandevclub.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* {new Date().getFullYear()} */}
              ColmanDevClub
            </a>
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div>Contributors:</div>
          <div>
            {ContributorsData.map((contributor) => (
              <TooltipProvider key={contributor.name}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="link" className="p-0">
                      <Link to={`/users/${contributor.id}`}>
                        <img
                          className="w-6 h-6 rounded-full border-[1px] border-zinc-500"
                          src={contributor.image}
                          alt={contributor.name}
                          // onClick={() =>
                          //   window.open(
                          //     contributor.link,
                          //     "_blank",
                          //     "noopener,noreferrer"
                          //   )
                          // }
                          style={{ cursor: "pointer" }}
                        />
                      </Link>
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
