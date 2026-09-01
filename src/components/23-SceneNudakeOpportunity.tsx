"use client";

/**
 * 20장 — What If Nudake Could Be Sent?
 *
 * 앞장에서 공간의 한계를 말했으니, 여기서 선물을 기회로 발견합니다.
 * 이 장이 있어야 뒤에 나오는 IA 문제가 "메뉴가 깊다" 가 아니라
 * "새 접점을 정의하고 보니 드러난 문제" 가 됩니다.
 * 그리드 11번 — 큰 문장 1–7단 1–3행 · 본문 두 단락 6–8단 5–6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 지금의 길과, 이 프로젝트가 여는 길. 걸음 수가 다른 것이 아니라
   시작하는 자리가 다릅니다 — 하나는 방문에서, 하나는 발견에서. */
const ROUTES = [
  {
    key: "store",
    label: "Physical Store",
    steps: ["방문한다", "경험한다", "구매한다"],
    place: "col-start-1 col-span-2",
  },
  {
    key: "gift",
    label: "Online Gift",
    steps: ["발견한다", "선택한다", "전달한다", "경험한다"],
    place: "col-start-4 col-span-2",
    lead: true,
  },
];

export function SceneNudakeOpportunity() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-start-1 col-span-6 row-start-1 row-span-2">
        What If Nudake
        <br />
        Could Be Sent?
      </h2>

      <p
        className="type-title rise self-start col-start-1 col-span-4 row-start-3"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        누데이크를 방문하지 않아도,
        <br />
        누군가에게 누데이크의 경험을 전달할 수 있다면?
      </p>

      {ROUTES.map((route, i) => (
        <div
          key={route.key}
          className={`nud-route rise ${route.place} row-start-5 row-span-2`}
          data-lead={route.lead || undefined}
          style={{ "--delay": `${0.24 + i * 0.14}s` } as CSSProperties}
        >
          <p className="nud-route-label">{route.label}</p>

          <ol className="nud-route-steps">
            {route.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ))}

      {/* 이 케이스에서 가장 중요한 한 문장입니다. */}
      <p
        className="nud-define rise col-start-6 col-span-3 row-start-5 row-span-2"
        style={{ "--delay": "0.56s" } as CSSProperties}
      >
        선물을 구매 방식이 아니라
        <br />
        <b>새로운 브랜드 접점</b>으로 정의했습니다.
      </p>
    </div>
  );
}
