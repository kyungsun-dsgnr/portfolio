"use client";

/**
 * 두 번째 판의 잔글씨 — `/v2` 에만 얹힙니다
 *
 * 첨부한 FluxDesign 화면의 작은 것들입니다.
 *   · 왼쪽 위 워드마크
 *   · 가운데 갈래 이름(지금 보고 있는 갈래만 진하게)
 *   · 그 옆에 있는 곳과 그곳의 지금 시각
 *   · 오른쪽 끝, 밑줄 그은 한 마디
 *   · 왼쪽 기둥에 걸린 `→ Overview` 와 `Services & Info`
 *   · 오른쪽 아래 `Next →` 와 몇 장째인지
 *
 * 판(canvas)과 같은 크기의 틀을 화면 한가운데 고정해 두고 그 안에 적습니다 —
 * 덱은 한 장씩 굴러가지만 이 잔글씨는 늘 같은 자리에 남습니다.
 * 글자가 앉는 자리는 덱과 같은 여덟 단이라, 기둥 위에 나란히 섭니다.
 */

import { useEffect, useState } from "react";

import { SLUGS } from "@/app/slugs";

/** 갈래 — 주소 첫 자리와 판 위에 적을 이름 */
const PARTS = [
  { at: "intro", name: "Overview", to: "switch" },
  { at: "work", name: "Directions", to: "work" },
  { at: "gentle-monster", name: "Gentle Monster", to: "gentle-monster-paper" },
  { at: "tamburins", name: "Tamburins", to: "tamburins" },
  { at: "nudake", name: "Nudake", to: "nudake" },
];

/** 이 판을 만든 곳. 시각은 이 도시의 지금입니다. */
const PLACE = "Seoul, Korea";
const ZONE = "Asia/Seoul";

const clock = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

export function V2Chrome() {
  /** 지금 보고 있는 장 — 굴릴 때마다 따라갑니다. */
  const [at, setAt] = useState(0);
  const [count, setCount] = useState(0);
  const [part, setPart] = useState("intro");
  /** 서버에서 그릴 때는 비워 둡니다 — 시각은 기기마다 다릅니다. */
  const [now, setNow] = useState("");

  useEffect(() => {
    /* 첫 시각은 한 틱 뒤에 적습니다 — 그림 도중에 상태를 건드리지 않게. */
    const first = window.setTimeout(() => setNow(clock()), 0);
    const tick = window.setInterval(() => setNow(clock()), 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".scroll-root");
    if (!root) return;

    const parts = () =>
      Array.from(root.querySelectorAll<HTMLElement>(".section"));

    let queued = 0;
    const read = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        const all = parts();
        const i = Math.round(root.scrollTop / root.clientHeight);
        const here = all[Math.min(i, all.length - 1)];
        setAt(i);
        setCount(all.length);
        /* 갈래는 그 장의 주소 첫 자리입니다 — `nudake/03` 이면 `nudake`.
           주소창은 굴림이 멎어야 갈리므로 장 id 에서 바로 읽습니다. */
        const slug = SLUGS[here?.id ?? ""] ?? "";
        setPart(slug.split("/")[0]);
      });
    };

    /* 처음 한 번도 한 틱 뒤에 읽습니다. */
    const first = window.setTimeout(read, 0);
    root.addEventListener("scroll", read, { passive: true });
    return () => {
      clearTimeout(first);
      root.removeEventListener("scroll", read);
      if (queued) cancelAnimationFrame(queued);
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const next = () => {
    const root = document.querySelector<HTMLElement>(".scroll-root");
    if (!root) return;
    root.scrollTo({ top: (at + 1) * root.clientHeight, behavior: "smooth" });
  };

  return (
    <div className="v2-chrome" aria-hidden={false}>
      <div className="v2-frame">
        {/* 왼쪽 위 — 이 판의 이름 */}
        <p className="v2-mark">What We Already Know®</p>

        {/* 가운데 — 갈래. 지금 보고 있는 것만 진하게 남습니다. */}
        <nav className="v2-nav" aria-label="갈래">
          {PARTS.map((one) => (
            <button
              key={one.at}
              type="button"
              data-on={one.at === part || undefined}
              onClick={() => go(one.to)}
            >
              {one.name}
            </button>
          ))}
        </nav>

        {/* 있는 곳과 그곳의 지금 */}
        <p className="v2-where">
          {PLACE}
          <span>{now ? `${now} (KST)` : " "}</span>
        </p>

        {/* 오른쪽 끝 — 한 마디. 주소를 넣을 자리는 아직 비워 둡니다. */}
        <p className="v2-hail">Start a Project</p>

        {/* 왼쪽 기둥에 걸린 두 줄 */}
        <button
          type="button"
          className="v2-back"
          onClick={() => go(PARTS[0].to)}
        >
          <i aria-hidden>→</i> Overview
        </button>

        <p className="v2-aside">Services &amp; Info</p>

        {/* 오른쪽 아래 — 다음 장으로. 몇 장째인지 함께 적습니다. */}
        <button type="button" className="v2-next" onClick={next}>
          <em>
            {String(at + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </em>
          Next <i aria-hidden>→</i>
        </button>
      </div>
    </div>
  );
}
