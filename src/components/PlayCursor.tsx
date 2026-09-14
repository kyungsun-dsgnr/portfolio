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

    /* 마지막 손끝 자리 — 손은 가만있고 판만 굴러갔을 때 그 자리 아래를 다시 봅니다. */
    let lastX = -1;
    let lastY = -1;

    const place = (x: number, y: number, target: EventTarget | null) => {
      const over =
        target instanceof Element && target.closest("[data-play-cursor]");
      if (!over) {
        el.removeAttribute("data-on");
        return;
      }
      /* 퍼센트는 요소 자기 크기 기준이라, 이 한 줄로 원의 가운데가 손끝에 맞습니다.
         오른쪽 아래로 비키는 만큼은 CSS 의 margin 이 맡습니다. */
      el.style.translate = `calc(${x}px - 50%) calc(${y}px - 50%)`;
      el.setAttribute("data-on", "");
      /* 어두운 장 위에서는 밝은 원으로 — 장의 어둠은 그 안의 것들로 압니다. */
      const dark = Boolean(
        over.closest(".section")?.matches(
          ":has(.compose-full), :has(.after-frame), :has(.page-grid[data-past]), :has(.statement-dark), :has(.thanks)",
        ),
      );
      el.toggleAttribute("data-light", dark);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      lastX = event.clientX;
      lastY = event.clientY;
      place(lastX, lastY, event.target);
    };
    /* 장이 굴러가면(손은 그대로) 손끝 아래에 무엇이 왔는지 다시 봅니다 —
       그러지 않으면 앞 장에서 켜진 표가 다음 장에도 그대로 남습니다. */
    const roll = () => {
      if (lastX < 0) return;
      place(lastX, lastY, document.elementFromPoint(lastX, lastY));
    };
    const leave = () => el.removeAttribute("data-on");

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("scroll", roll, { capture: true, passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", move);
      document.removeEventListener("scroll", roll, { capture: true });
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
