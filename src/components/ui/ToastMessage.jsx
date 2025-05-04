import { toast } from "sonner";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

export default function ToastMessage({ type = "success", message, duration = 5000 }) {
  const isSuccess = type === "success";
  const isError = type === "error";
  const isInfo = type === "info";

  toast.custom(
    () => (
      <div
        className={`w-[300px] rounded-lg p-4 shadow-lg text-white flex gap-3 items-start ${
          isSuccess ? "bg-green-600" : isError ? "bg-red-600" : "bg-orange-600"
        }`}
      >
        <div className="mt-1">
          {isSuccess ? (
            <CheckCircle className="w-6 h-6" />
          ) : isError ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <Info className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="font-semibold">
            {isSuccess ? "Success!" : isError ? "Error!" : "Info!"}
          </p>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>
    ),
    { duration }
  );
}
