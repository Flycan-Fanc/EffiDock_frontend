import { useEffect, useRef } from "react";

export function useSmoothScrollSection(trigger: string | null) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!trigger) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      const targetTop =
        (containerRef.current?.getBoundingClientRect().top ?? 0) +
        window.scrollY -
        24;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [trigger]);

  return {
    containerRef,
  };
}
