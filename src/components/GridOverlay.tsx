"use client";

import { useEffect, useState } from "react";

type Spec = { cols: number; rows: number; gap: string; margin: string };

/** globals.css의 토큰을 그대로 읽어 옵니다. 값을 바꾸면 가이드도 따라갑니다. */
function readSpec(): Spec {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;

  return {
    cols: Number(token("--grid-cols", "8")),
    rows: Number(token("--grid-rows", "6")),
    gap: token("--grid-gap", "16px"),
    margin: token("--page-margin", "30px"),
  };
}

/**
 * 개발용 그리드 가이드. G 키로 켜고 끕니다.
 * 실제 콘텐츠 위에 겹쳐 그리므로 클릭은 통과시킵니다.
 */
export function GridOverlay() {
  const [spec, setSpec] = useState<Spec | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // 입력 중일 때는 무시
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== "g" && event.key !== "G") return;

      setSpec((current) => (current ? null : readSpec()));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!spec) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div className="page-grid">
        {Array.from({ length: spec.cols * spec.rows }, (_, i) => (
          <div key={i} className="bg-sky-500/10 outline-1 outline-sky-500/50" />
        ))}
      </div>
      <p className="fixed right-2 bottom-2 font-mono text-[10px] text-sky-500">
        {spec.cols}×{spec.rows} · gap {spec.gap} · margin {spec.margin} — press G
      </p>
    </div>
  );
}
