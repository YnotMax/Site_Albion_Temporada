import { useState, useEffect, useRef } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "none">("none");
  const scrollDirectionRef = useRef<"up" | "down" | "none">("none");

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }

      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirectionRef.current && scrollY > 50) {
        scrollDirectionRef.current = direction;
        setScrollDirection(direction);
      } else if (scrollY <= 50 && scrollDirectionRef.current !== "none") {
        scrollDirectionRef.current = "none";
        setScrollDirection("none");
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollDirection;
}
