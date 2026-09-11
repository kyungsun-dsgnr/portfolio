"use client";

/**
 * 논리 장 한 벌
 *
 * 케이스 사이사이에 서서 '왜 이렇게 했는가' 를 한 장으로 적는 자리입니다.
 * 아홉 장이 같은 판을 쓰도록 컴포넌트 하나에 모으고, 장마다 다른 것은
 * 아래의 표 하나로 둡니다 — 제목 · 한 문장 · 설명, 그리고 셋 중 하나:
 *
 *   chain  한 줄로 선 흐름      (Sensory cue → Familiar behavior → …)
 *   points 나란히 놓이는 덩이   (문제 · 원칙)
 *   sides  지난 판과 지금 판    (Before / After)
 *
 * 아무것도 없으면 한 문장만 크게 서는 마무리 장이 됩니다.
 */

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

export type Logic = {
  /** 제목 */
  title: ReactNode;
  /** 제목 아래 한 줄. 표지 오른쪽 글과 같은 단입니다. */
  sub: string;
  /** 그 아래 설명 한 덩이 */
  body?: string;
  chain?: string[];
  points?: { no: string; name?: string; body: string }[];
  sides?: { before: string; after: string }[];
  /** 판 아래에 조용히 남는 한 문장 */
  line?: string;
  /** 한 문장만 크게 세우는 마무리 장 */
  last?: boolean;
};

/* ── 젠틀몬스터 ─────────────────────────── */
export const GM_LIMIT: Logic = {
  title: "Existing Store Search Limitation",
  sub: "Local search solves access, but not awareness",
  body: "기존 흐름은 사용자가 가까운 매장을 찾는 데는 도움이 되지만, 젠틀몬스터가 가진 글로벌한 규모와 공간적 정체성을 보여주지는 못합니다.",
  chain: ["Current location", "Store list", "Store detail"],
  line: "Efficient, but locally bounded.",
};

export const GM_LOGIC: Logic = {
  title: "Design Logic: Local to Global",
  sub: "Two entry points for two user intentions",
  sides: [
    { before: "Find Nearby", after: "Explore Globally" },
    { before: "Use current location", after: "Rotate globe" },
    { before: "Store list", after: "Choose city, discover stores" },
  ],
  line: "The interface separates user intention, not brand experience.",
};

/* ── 탬버린즈 ───────────────────────────── */
export const TAM_MAP: Logic = {
  title: "Current Gift Flow Map",
  sub: "A gift is assembled across disconnected steps",
  chain: [
    "Gift List",
    "Product Detail",
    "Set Option",
    "Scent 1",
    "Scent 2",
    "Bag",
  ],
  line: "The final gift appears only after several separate decisions.",
};

export const TAM_REFRAME: Logic = {
  title: "Reframe: From Buying to Composing",
  sub: "From option selection to sensory composition",
  sides: [
    { before: "Buying a set", after: "Composing a gift" },
    { before: "Choosing options", after: "Building a mood" },
    { before: "Final confirmation", after: "Continuous preview" },
  ],
  line: "The user should not wait until the end to understand the gift.",
};

export const TAM_AFTER: Logic = {
  title: "Before / After",
  sub: "From completing a purchase flow to making a gift",
  sides: [
    { before: "Scattered selections", after: "Visible composition" },
    { before: "Option-first", after: "Mood-first" },
    { before: "Final gift appears late", after: "Gift stays present" },
  ],
};

/* ── 누데이크 ───────────────────────────── */
export const NUD_PLACE: Logic = {
  title: "Place-Bound Experience",
  sub: "The brand is experienced strongly in place, but weakly in flow",
  body: "Offline, products are discovered through space and atmosphere. Online, they often become isolated items in a purchase path.",
  sides: [
    { before: "Place", after: "Online" },
    { before: "Display, discovery", after: "List, detail" },
    { before: "Memory", after: "Checkout" },
  ],
};

export const NUD_LOGIC: Logic = {
  title: "Design Logic: Memory to Gift",
  sub: "Connecting place, product, message, and recipient",
  chain: [
    "Choose a place memory",
    "Select product",
    "Add message",
    "Compose gift",
  ],
  line: "The flow keeps the origin of discovery visible until the gift is complete.",
};

/* ── 마무리 ─────────────────────────────── */
export const TAKEAWAY: Logic = {
  title: "Design Takeaway",
  sub: "Familiar memory can become interaction structure",
  line: "Across three cases, I translated familiar sensory behaviors into digital flows: light into response, distance into exploration, and memory into gifting.",
  last: true,
};

export function SceneLogic({ plan }: { plan: Logic }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 마무리 장은 제목과 한 문장만 크게 섭니다. */
  if (plan.last) {
    return (
      <div ref={ref} className="page-grid" data-visible={inView || undefined}>
        <h2 className="type-lead capitalize rise col-start-1 col-span-5 row-start-1">
          {plan.title}
        </h2>

        <p
          className="type-title rise self-start col-start-1 col-span-6 row-start-2"
          style={{ "--delay": "0.1s" } as CSSProperties}
        >
          {plan.sub}
        </p>

        {plan.line && (
          <p
            className="type-lead rise self-center col-start-1 col-span-7 row-start-4 row-span-2"
            style={{ "--delay": "0.18s" } as CSSProperties}
          >
            {plan.line}
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-5 row-start-1">
        {plan.title}
      </h2>

      {/* 표지 오른쪽의 `Designing Digital Experiences…` 와 같은 단입니다. */}
      <p
        className="type-title rise self-start col-start-1 col-span-6 row-start-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        {plan.sub}
      </p>

      {plan.body && (
        <p
          className="type-body rise self-start col-start-1 col-span-4 row-start-3"
          style={{ "--delay": "0.16s" } as CSSProperties}
        >
          {plan.body}
        </p>
      )}

      {/* 한 줄로 선 흐름. 마지막 칸만 채워 도착을 표시합니다. */}
      {plan.chain && (
        <div className="logic-track rise col-start-1 col-span-8 row-start-5">
          {plan.chain.map((step, i) => (
            <span key={step} className="contents">
              {i > 0 ? <i aria-hidden>→</i> : null}
              <b
                className="flow-pill"
                data-tone={i === plan.chain!.length - 1 ? "start" : undefined}
              >
                {step}
              </b>
            </span>
          ))}
        </div>
      )}

      {/* 나란히 놓이는 덩이 */}
      {plan.points?.map((point, i) => (
        <div
          key={point.no}
          className="logic-point nud-ruled rise self-end row-start-5 row-span-2"
          style={
            {
              "--delay": `${0.2 + i * 0.08}s`,
              gridColumn: `${1 + i * 3} / span 3`,
            } as CSSProperties
          }
        >
          <p className="steps-no">{point.no}</p>
          {point.name && <h3 className="steps-step">{point.name}</h3>}
          <p className="steps-kind">{point.body}</p>
        </div>
      ))}

      {/* 지난 판과 지금 판 */}
      {plan.sides && (
        <div className="logic-sides rise col-start-1 col-span-8 row-start-4 row-span-2">
          {plan.sides.map((row, i) => (
            <div
              key={row.before}
              className="logic-side nud-ruled"
              style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
            >
              <p>{row.before}</p>
              <p data-on>{row.after}</p>
            </div>
          ))}
        </div>
      )}

      {/* 판 아래에 조용히 남는 한 문장 */}
      {plan.line && (
        <p
          className="logic-line rise self-end col-start-1 col-span-6 row-start-6"
          style={{ "--delay": "0.3s" } as CSSProperties}
        >
          {plan.line}
        </p>
      )}
    </div>
  );
}
