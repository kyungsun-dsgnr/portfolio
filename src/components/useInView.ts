"use client";

import { useEffect, useRef, useState } from "react";

/** 요소가 화면에 들어와 있는지 알려 줍니다. 섹션에 들어올 때 애니메이션을 시작할 때 씁니다. */
export function useInView<T extends HTMLElement>(threshold = 0.6) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}
