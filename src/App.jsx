import { useState } from "react";
import "./App.css";
import Router from "../Router";
import Header from "./components/Header/Header";
import Aurora from "./components/ui/Aurora";
import NetBackground from "./components/NetBackground";
import { Toaster } from "sonner";
import { Button } from "./components/ui/button";
import OpenPage from "./components/OpenPage/OpenPage";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLightTheme, setShowLightTheme] = useState(false); // שליטה באיזה NetBackground מוצג

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

      {showWelcome ? (
        <OpenPage
          setShowLightTheme={setShowLightTheme}
          setShowWelcome={setShowWelcome}
        />
      ) : (
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
