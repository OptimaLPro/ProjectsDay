import { HashLoader } from "react-spinners";

const InPlaceLoader = () => {
  return (
    <div className="z-50 flex items-center justify-center">
      <HashLoader color="#171717" loading size={40} />
    </div>
  );
};

export default InPlaceLoader;
