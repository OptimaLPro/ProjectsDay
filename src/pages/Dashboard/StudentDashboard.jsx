import { Button } from "@/components/ui/button";
import { Edit, Link2, LogOut, Plus } from "lucide-react";
import { Link } from "react-router";
import UnassignProjectButton from "./UnassignProjectButton";

const StudentDashboard = ({ hasProject, onLogout }) => {
  return (
    <div className="mt-5 max-w-[90%] mx-auto realtive">
      <main className="container mx-auto px-5 lg:px-4 relative">
        <div className="flex flex-col md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-center">Student Dashboard</h1>
          <div className="flex gap-3 flex-col justify-center items-center mt-12">
            {!hasProject ? (
              <>
                <Link to="/dashboard/add-project">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </Link>
                <Link to="/dashboard/assign-project">
                  <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <Link2 className="h-4 w-4" />
                    Assign Project
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard/update-project">
                  <Button className="gap-2">
                    <Edit className="h-4 w-4" />
                    Update Project
                  </Button>
                </Link>
                <UnassignProjectButton />
              </>
            )}
            <Button variant="outline" className="gap-2" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
