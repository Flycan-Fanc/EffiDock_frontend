import { useEffect, useRef } from "react";

export function useScrollToEditor(trigger: string | null) {
  const containerRef = useRef<HTMLElement | null>(null);
  const focusTargetRef = useRef<HTMLInputElement | null>(null);

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

      window.setTimeout(() => {
        focusTargetRef.current?.focus({ preventScroll: true });
        focusTargetRef.current?.select?.();
      }, 220);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [trigger]);

  return {
    containerRef,
    focusTargetRef,
  };
}
