import { BackgroundBeams } from "@/components/ui/background-beams";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import BottomHero from "./BottomHero";
import { useAuth } from "@/context/AuthContext";
import { useHomepage } from "@/hooks/useHomepage";

const Hero = () => {
  const [carouselApi, setCarouselApi] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { year } = useAuth();
  const { data: homepageData, isLoading } = useHomepage();

  const youtubeRecord = homepageData?.find((item) => item.type === "youtube");
  const herotextRecord = homepageData?.find((item) => item.type === "herotext");

  const youtubeLinks = youtubeRecord?.videos || [];
  const herotext = herotextRecord?.text?.replace("{year}", year) || "";

  const [loadedVideos, setLoadedVideos] = useState(
    new Array(youtubeLinks.length).fill(false)
  );

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

  return (
    <main className="mb-12">
      <Card className="p-0 overflow-hidden transition-all duration-300 border shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
        <div className="flex flex-col-reverse h-auto lg:flex-row">
          {/* Left side text */}
          <div className="flex flex-col items-start justify-between w-full px-3 py-3 md:w-1/3">
            <div className="flex flex-col px-6 py-3 text-[30px] lg:text-[50px] xl:text-[70px] font-bold text-[#131313] leading-[1.1] ">
              {herotext.split("\\n").map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))}
            </div>
            <BottomHero />
          </div>

          {/* Right side YouTube carousel */}
          <div className="z-10 flex flex-col items-end justify-center w-full md:w-2/3 ">
            <div className="w-full h-full ">
              <Carousel
                className="w-full h-full "
                opts={{ loop: true }}
                setApi={setCarouselApi}
              >
                <CarouselContent className="h-full">
                  {(isLoading ? Array(4).fill("") : youtubeLinks).map(
                    (link, index) => {
                      const videoId = getYouTubeId(link);
                      return (
                        <CarouselItem
                          key={index}
                          className="relative flex items-center justify-end h-full px-0 "
                        >
                          <div className=" aspect-video w-full md:max-w-[95%] rounded-l-[30px] overflow-hidden bg-black relative">
                            {/* Skeleton until video loads */}
                            {!loadedVideos[index] && (
                              <Skeleton className="absolute inset-0 w-full h-full rounded-l-[30px]" />
                            )}

                            {activeSlide === index && videoId && (
                              <YouTube
                                videoId={videoId}
                                opts={{
                                  width: "100%",
                                  height: "100%",
                                  playerVars: {
                                    autoplay: 1,
                                    mute: 1,
                                    controls: 1,
                                    modestbranding: 1,
                                    rel: 0,
                                    playsinline: 1,
                                    loop: 1,
                                  },
                                }}
                                className="w-full h-full "
                                onReady={() => {
                                  setLoadedVideos((prev) => {
                                    const updated = [...prev];
                                    updated[index] = true;
                                    return updated;
                                  });
                                }}
                              />
                            )}

                            {/* Next button */}
                            <button
                              onClick={() => {
                                if (!carouselApi) return;
                                const nextIndex =
                                  (activeSlide + 1) % youtubeLinks.length;
                                carouselApi.scrollTo(nextIndex);
                              }}
                              className="absolute z-10 p-2 transition bg-white rounded-full shadow-lg bottom-4 lg:left-4 left-8 hover:bg-gray-100"
                            >
                              <svg
                                className="w-5 h-5 text-gray-800"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </CarouselItem>
                      );
                    }
                  )}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
        <BackgroundBeams />
      </Card>
    </main>
  );
};

export default Hero;
