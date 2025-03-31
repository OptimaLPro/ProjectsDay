import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { instructors } from "@/assets/InstructorsData";

const Instructors = () => {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-5 lg:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 items-center relative">
          {instructors.map((instructor) => (
            <Dialog key={instructor.id}>
              <DialogTrigger className="cursor-pointer items-center justify-center flex flex-col">
                <img
                  src={instructor.image || "/instructors/default.jpg"}
                  alt={instructor.name}
                  className="h-48 w-48 object-cover rounded-lg shadow-md"
                />
                <div className="text-center mt-2 font-semibold text-lg">
                  {instructor.name}
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{instructor.name}</DialogTitle>
                  <DialogDescription>
                    <img
                      src={instructor.image || "/instructors/default.jpg"}
                      alt={instructor.name}
                      className="h-48 w-48 object-cover rounded-lg shadow-md mx-auto mb-4"
                    />
                    {instructor.description}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Instructors;
