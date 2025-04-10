import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
  import { useState, useEffect } from "react";
  
  const ProjectMedia = ({ project }) => {
    const [carouselApi, setCarouselApi] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
  
    useEffect(() => {
      if (!carouselApi) return;
      carouselApi.on("select", () => {
        setActiveSlide(carouselApi.selectedScrollSnap());
      });
    }, [carouselApi]);
  
    return (
      <div className="mt-10 lg:mt-16 flex flex-col lg:flex-row gap-10">
        {/* Gallery */}
        {project?.gallery?.length > 0 && (
          <div className="lg:w-1/2 w-full">
            <h2 className="text-lg font-semibold mb-2 text-center lg:text-left">
              Gallery
            </h2>
  
            <div className="overflow-hidden rounded-md shadow-md">
              <div className="aspect-video w-full h-full">
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
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
  
            <div className="flex justify-center mt-4 gap-2">
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
          </div>
        )}
  
        {/* YouTube */}
        {project?.youtube && (
          <div className="lg:w-1/2 w-full">
            <h2 className="text-lg font-semibold mb-2 text-center lg:text-left">
              Project Video
            </h2>
            <div className="overflow-hidden rounded-md shadow-md">
              <div className="aspect-video w-full h-full">
                <iframe
                  src={project.youtube.replace("watch?v=", "embed/")}
                  title="Project Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ProjectMedia;
  