"use client";

/**
 * 26장 — Experience Nudake, Anywhere
 *
 * 기능을 다시 설명하지 않습니다. 브랜드 경험이 어떻게 달라졌는지만
 * 한 장으로 적고, 표지의 말을 다시 불러 케이스를 닫습니다.
 * 그리드 11번 — 큰 문장 1–7단 1–2행 · 본문 두 단락 5–6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 지금은 길이 하나뿐입니다 — 방문해야 만납니다. */
const BEFORE = [{ way: "Visit", to: "Experience Nudake" }];

/* 제안한 뒤에는 길이 둘입니다. 앞의 것을 대체하지 않고 하나가 늘어납니다. */
const AFTER = [
  { way: "Visit", to: "Experience Nudake" },
  { way: "Receive", to: "Experience Nudake", add: true },
];

function Ways({
  label,
  ways,
}: {
  label: string;
  ways: { way: string; to: string; add?: boolean }[];
}) {
  return (
    <div className="nud-ways">
      <p className="nud-eyebrow">{label}</p>

      <div className="nud-ways-list">
        {ways.map((one) => (
          <div className="nud-way" key={one.way} data-add={one.add || undefined}>
            <b>{one.way}</b>
            <i aria-hidden />
            <span>{one.to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SceneNudakeFinal() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-start-1 col-span-7 row-start-1 row-span-2">
        Experience Nudake,
        <br />
        Anywhere
      </h2>

      <div
        className="rise col-start-1 col-span-3 row-start-3 row-span-2"
        style={{ "--delay": "0.16s" } as CSSProperties}
      >
        <Ways label="Before" ways={BEFORE} />
      </div>

      <div
        className="rise col-start-5 col-span-4 row-start-3 row-span-2"
        style={{ "--delay": "0.26s" } as CSSProperties}
      >
        <Ways label="Proposed" ways={AFTER} />
      </div>

      <p
        className="type-title rise col-start-1 col-span-4 row-start-5 row-span-2"
        style={{ "--delay": "0.38s" } as CSSProperties}
      >
        누데이크의 공간 경험을 대체하지 않고,
        <br />
        선물을 통해 브랜드를 경험할 수 있는
        <br />또 하나의 접점을 만듭니다.
      </p>

      {/* 표지의 말을 그대로 다시 꺼내 케이스를 닫습니다. */}
      <p
        className="type-title rise col-start-6 col-span-3 row-start-6 text-right"
        style={{ "--delay": "0.5s" } as CSSProperties}
      >
        From Visiting Nudake
        <br />
        to Sending Nudake
      </p>
    </div>
  );
}
