import { toast } from "sonner";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function ToastMessage({ type = "success", message, duration = 5000 }) {
  const isSuccess = type === "success";

  toast.custom(
    () => (
      <div
        className={`w-[300px] rounded-lg p-4 shadow-lg text-white flex gap-3 items-start ${
          isSuccess ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <div className="mt-1">
          {isSuccess ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div>
          <p className="font-semibold">
            {isSuccess ? "Success!" : "Error!"}
          </p>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
    ),
    { duration }
  );
}
