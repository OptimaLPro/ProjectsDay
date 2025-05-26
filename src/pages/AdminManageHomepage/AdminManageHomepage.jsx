import { useEffect, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import { useHomepage } from "@/hooks/useHomepage";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import ToastMessage from "@/components/ui/ToastMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AdminManageHomepage() {
  const queryClient = useQueryClient();
  const { data: homepageData = [], isLoading, isError } = useHomepage();
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [herotext, setHerotext] = useState("");

  useEffect(() => {
    const youtube = homepageData.find((item) => item.type === "youtube");
    const text = homepageData.find((item) => item.type === "herotext");
    if (youtube) setYoutubeLinks(youtube.videos);
    if (text) setHerotext(text.text);
  }, [homepageData]);

  const mutation = useMutation({
    mutationFn: () =>
      Promise.all([
        api.put("/homepage/youtube", { videos: youtubeLinks }),
        api.put("/homepage/herotext", { text: herotext }),
      ]),
    onSuccess: () => {
      queryClient.invalidateQueries(["homepage"]);
      ToastMessage({ type: "success", message: "Homepage updated!" });
    },
    onError: () => {
      ToastMessage({ type: "error", message: "Failed to update homepage." });
    },
  });

  const handleSave = () => {
    mutation.mutate();
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className="relative max-w-4xl mx-auto mt-10 space-y-8">
      <h1 className="text-2xl font-bold text-center">Manage Homepage</h1>
      <div className="space-y-2">
        <Label>YouTube Links</Label>
        {youtubeLinks.map((link, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              className="flex-1 bg-white"
              value={link}
              onChange={(e) => {
                const copy = [...youtubeLinks];
                copy[index] = e.target.value;
                setYoutubeLinks(copy);
              }}
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setYoutubeLinks((prev) => prev.filter((_, i) => i !== index));
              }}
            >
              Delete
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setYoutubeLinks((prev) => [...prev, ""])}
        >
          + Add Link
        </Button>
      </div>
      <div className="space-y-2">
        <Label>Hero Text (use {"\\n"} for newline)</Label>
        <Textarea
          className="h-40 font-mono bg-white"
          value={herotext}
          onChange={(e) => setHerotext(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={mutation.isLoading}>
          {mutation.isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
