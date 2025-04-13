import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center my-12">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="mb-12 w-10 h-10 p-2 text-white bg-zinc-600 rounded-full flex items-center justify-center shadow-md hover:bg-gray-800 transition pointer duration-200 cursor-pointer"
      />
    </div>
  );
};

export default BackButton;
