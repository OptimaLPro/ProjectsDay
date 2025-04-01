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
    <main className="mx-auto mt-5 px-5 lg:px-4 max-w-[90%]">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 relative">
        {instructors.map((instructor) => (
          <Dialog key={instructor.id}>
            <DialogTrigger className="cursor-pointer flex flex-col lg:items-center">
              <img
                src={instructor.image || "/instructors/default.jpg"}
                alt={instructor.name}
                className="h-48 w-48 object-cover rounded-lg shadow-md"
              />
              <div className="text-center mt-2 font-semibold text-lg flex items-center justify-center ">
                {instructor.name}
              </div>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
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
  );
};

export default Instructors;
