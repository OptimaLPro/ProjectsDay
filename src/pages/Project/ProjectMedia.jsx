import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";

const ProjectMedia = ({ project }) => {
  const [carouselApi, setCarouselApi] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("select", () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const getYouTubeId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1] || null;
  };

  const videoId = getYouTubeId(project.youtube);

  return (
    <div className="flex flex-col justify-center gap-10 mt-10 lg:mt-16 lg:flex-row">
      {/* Gallery */}
      <div className="w-full lg:w-1/2">
        <h2 className="mb-2 text-lg font-semibold text-center lg:text-left">
          Gallery
        </h2>

        {project?.gallery?.length > 0 ? (
          <>
            <div className="overflow-hidden rounded-md shadow-md">
              <div className="w-full h-full aspect-video">
                <Carousel
                  className="w-full h-full"
                  opts={{ loop: true }}
                  setApi={setCarouselApi}
                >
                  <CarouselContent className="h-full">
                    {project.gallery.map((url, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="w-full h-full">
                          <img
                            src={url}
                            alt={`gallery-${index}`}
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {project.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (carouselApi) {
                      carouselApi.scrollTo(index);
                      setActiveSlide(index);
                    }
                  }}
                  className={`w-2 h-2 rounded-full ${
                    index === activeSlide
                      ? "bg-primary"
                      : "bg-gray-400 hover:bg-gray-600"
                  } transition`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="px-3 py-4 border shadow-lg lg:flex lg:items-center lg:justify-between lg:gap-12 bg-white/30 backdrop-blur-md border-white/30 rounded-xl lg:pl-8 lg:px-0 lg:pr-2 h-[150px] ">
            No images uploaded.
          </div>
        )}
      </div>

      {/* YouTube */}
      {videoId && (
        <div className="w-full lg:w-1/2">
          <h2 className="mb-2 text-lg font-semibold text-center lg:text-left">
            Project Video
          </h2>
          <div className="overflow-hidden rounded-md shadow-md">
            <div className="w-full h-full aspect-video">
              <YouTube
                videoId={videoId}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 0,
                    playsinline: 1,
                    modestbranding: 1,
                    rel: 0,
                  },
                }}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMedia;
