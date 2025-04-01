import "./App.css";
import Router from "../Router";
import Header from "./components/Header/Header";
import Aurora from "./components/ui/Aurora";

function App() {
  return (
    <>
      <div className="z-[-10]">
        <Aurora
          colorStops={["#9443fc", "#4e59f0", "#2bbba4"]}
          blend={1}
          amplitude={1.0}
          speed={0.1}
        />
      </div>
      <div className="lg:pt-10 pt-5 px-5">
        <Header />
      </div>
      <Router />
    </>
  );
}

export default App;
