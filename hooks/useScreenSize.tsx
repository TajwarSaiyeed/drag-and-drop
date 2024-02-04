import { useEffect, useState } from "react";

export default function useScreenSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSm, setIsSm] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [isXl, setIsXl] = useState(false);
  const [is2xl, setIs2xl] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const screenWidth = window.innerWidth;

      setIs2xl(screenWidth >= 1536);
      setIsXl(screenWidth >= 1280 && !is2xl);
      setIsLg(screenWidth >= 1024 && !isXl && !is2xl);
      setIsMd(screenWidth >= 768 && !isLg && !isXl && !is2xl);
      setIsSm(screenWidth >= 640 && !isMd && !isLg && !isXl && !is2xl);
      setIsMobile(
        screenWidth < 640 && !isSm && !isMd && !isLg && !isXl && !is2xl
      );
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [is2xl, isLg, isMd, isSm, isXl]);

  return {
    isMobile,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
  };
}
