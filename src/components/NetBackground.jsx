import { useEffect, useRef } from "react";

const NetBackground = ({ theme, isVisible }) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (window.VANTA) {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }

      const themes = {
        dark: {
          color: 0x0077cc,
          backgroundColor: 0x000000,
        },
        light: {
          color: 0x1ea8ef,
          backgroundColor: 0xb7e3ff,
        },
      };

      vantaEffect.current = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        ...themes[theme],
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [theme]);

  return (
    <div
      ref={vantaRef}
      className={`w-full h-screen fixed z-[-1] transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

export default NetBackground;
