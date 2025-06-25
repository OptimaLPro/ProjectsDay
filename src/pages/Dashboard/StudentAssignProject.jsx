import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader/Loader";
import Error from "@/components/Error/Error";
import { useMyProject } from "@/hooks/useMyProject";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import ToastMessage from "@/components/ui/ToastMessage";
import { useInternships } from "@/hooks/useInternships";
import { Card } from "@/components/ui/card";
import { getProjectsByInternship } from "@/api/projects";

export default function StudentAssignProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const {
    data: myProjectData,
    isLoading: loadingMyProject,
    isError: errorMyProject,
  } = useMyProject();

  const { data: internshipsData = [], isLoading: loadingInternships } =
    useInternships();

  const userInternshipId = user?.internship;

  // const {
  //   data: projects,
  //   isLoading: loadingProjects,
  //   isError: errorProjects,
  // } = useQuery({
  //   queryKey: ["available-projects", userInternshipId],
  //   queryFn: async () => {
  //     const { data } = await api.get("/projects");
  //     console.log("Available Projects:", data.projects);
  //     console.log("User Internship ID:", userInternshipId);
  //     return data.projects;
  //     // return data.projects.filter(
  //     //   (p) => p.internship?._id?.toString() === userInternshipId?.toString()
  //     // );
  //   },
  //   enabled: !!userInternshipId && myProjectData?.exists === false,
  // });

  const {
    data: projects,
    isLoading: loadingProjects,
    isError: errorProjects,
  } = useQuery({
    queryKey: ["available-projects", userInternshipId],
    queryFn: () => getProjectsByInternship(userInternshipId),
    enabled: !!userInternshipId && myProjectData?.exists === false,
  });

  const isLoading = loadingMyProject || loadingProjects || loadingInternships;
  const isError = errorMyProject || errorProjects;

  const mutation = useMutation({
    mutationFn: (projectId) => api.put(`/projects/${projectId}/assign`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myProject"]);
      queryClient.invalidateQueries(["available-projects"]);
      navigate("/dashboard");
      ToastMessage({
        type: "success",
        message: "You've been assigned to a project.",
      });
    },
    onError: () => {
      ToastMessage({ type: "error", message: "Please try again later." });
    },
  });

  const handleConfirm = () => {
    mutation.mutate(selectedProjectId);
    setShowDialog(false);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  if (myProjectData?.exists) {
    return (
      <div className="max-w-md p-6 mx-auto mt-10 text-center bg-white shadow-lg rounded-xl">
        <h1 className="mb-4 text-xl font-semibold">Assign Project</h1>
        <p>You are already assigned to a project.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-md p-6 mx-auto mt-10 rounded-xl">
      <Card className="p-6 transition-all border shadow-xl hover:shadow-2xl backdrop-blur-md bg-white/40 border-white/30">
        <h1 className="mb-4 text-xl font-semibold text-center">
          Assign Project
        </h1>

        <div className="flex justify-center ">
          <Select
            value={selectedProjectId}
            onValueChange={(val) => setSelectedProjectId(val)}
          >
            <SelectTrigger className="bg-white w-74">
              <SelectValue placeholder="Select a Project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => setShowDialog(true)}
          className="w-full mt-4"
          disabled={mutation.isPending || !selectedProjectId}
        >
          {mutation.isPending ? "Assigning..." : "Assign Me to This Project"}
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <p>
              You are about to join this project. This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleConfirm}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Assigning..." : "Yes, Assign Me"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
