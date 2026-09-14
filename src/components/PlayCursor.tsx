"use client";

/**
 * 누르면 재생되는 자리 위의 재생 표
 *
 * 기본 커서는 그대로 두고, 그 오른쪽 아래에 둥근 원(6장 VIEW 커서의 가운데 원)이
 * 따라다니며 안에 재생 세모가 앉습니다. 덱에 한 벌만 두고, `data-play-cursor` 가
 * 붙은 요소 위에 손이 있을 때만 보입니다. 마우스일 때만 — 터치에서는 남아 버립니다.
 */

import { useEffect, useRef } from "react";

export function PlayCursor() {
  const core = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = core.current;
    if (!el) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = event.target;
      const over =
        target instanceof Element && target.closest("[data-play-cursor]");
      if (!over) {
        el.removeAttribute("data-on");
        return;
      }
      /* 퍼센트는 요소 자기 크기 기준이라, 이 한 줄로 원의 가운데가 손끝에 맞습니다.
         오른쪽 아래로 비키는 만큼은 CSS 의 margin 이 맡습니다. */
      el.style.translate = `calc(${event.clientX}px - 50%) calc(${event.clientY}px - 50%)`;
      el.setAttribute("data-on", "");
      /* 어두운 장 위에서는 밝은 원으로 — 장의 어둠은 그 안의 것들로 압니다. */
      const dark = Boolean(
        over.closest(".section")?.matches(
          ":has(.compose-full), :has(.after-frame), :has(.page-grid[data-past]), :has(.statement-dark), :has(.thanks)",
        ),
      );
      el.toggleAttribute("data-light", dark);
    };
    const leave = () => el.removeAttribute("data-on");

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return (
    <div ref={core} className="view-cursor-core play-core" aria-hidden>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M8 5 19 12 8 19 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
