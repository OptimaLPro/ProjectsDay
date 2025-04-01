import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center h-screen bg-opacity-90">
      <HashLoader color="#171717" loading size={40} />
    </div>
  );
};

export default Loader;
