import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Please wait
    </Button>
  );
}
