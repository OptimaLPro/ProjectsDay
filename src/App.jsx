import { useEffect, useState } from "react";
import "./App.css";
import Router from "../Router";
import Header from "./components/Header/Header";
import Aurora from "./components/ui/Aurora";
import NetBackground from "./components/NetBackground";
import OpenPage from "./components/OpenPage/OpenPage";
import { Toaster } from "sonner";

function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLightTheme, setShowLightTheme] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    const theme = sessionStorage.getItem("theme");

    if (!hasVisited) {
      // פעם ראשונה - מציג את welcome ושומר שביקר
      setShowWelcome(true);
      sessionStorage.setItem("hasVisited", "true");
    }

    if (theme === "light") {
      setShowLightTheme(true);
    }
  }, []);

  const handleSetLightTheme = () => {
    setShowLightTheme(true);
    sessionStorage.setItem("theme", "light");
  };

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

      <NetBackground theme="dark" isVisible={!showLightTheme} />
      <NetBackground theme="light" isVisible={showLightTheme} />

      {showWelcome && (
        <OpenPage
          setShowLightTheme={handleSetLightTheme}
          setShowWelcome={setShowWelcome}
        />
      )}

      {!showWelcome && (
        <>
          <div className="lg:pt-10 pt-5 px-5">
            <Header />
          </div>
          <Router />
        </>
      )}

      <Toaster />
    </>
  );
}

export default App;