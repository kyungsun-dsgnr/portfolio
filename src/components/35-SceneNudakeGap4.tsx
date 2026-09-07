"use client";

/**
 * 누데이크 05 — 전환
 *
 * 오른쪽 넉 단에 덩이 셋, 왼쪽 넉 단에 화면 하나.
 * 새 화면이 나오기 전까지는 앞 장과 같은 목록 화면을 자리만 잡아 세워 둡니다.
 *
 * 카드마다 오른쪽에 꺾쇠가 있어, 누르면 앞 장(Found Here)의 같은 자리 글이
 * 아래로 펼쳐집니다 — 무엇이 달라졌는지 나란히 놓고 볼 수 있습니다.
 */

import { useState, type CSSProperties } from "react";

import { NudakeMockList } from "@/components/NudakeScreens";
import { useInView } from "@/components/useInView";

/* 손이 닿는 걸음은 채워서 세웁니다 — 여기가 이 흐름의 몫입니다. */
const FILLED = new Set(["COMPOSE", "PLACE IN GIFT"]);

/* 앞 장(Found Here)의 같은 자리 글. 펼쳤을 때 아래에 붙습니다. */
const BEFORE = [
  {
    eyebrow: "Experience Gap",
    title: "Found in NUDAKE",
    body: "사용자는 누데이크 안에서 Tea Gift를 발견하고 제품을 확인합니다. 하지만 Gift를 발견한 이후의 경험은 브랜드 안에서 이어지지 않습니다.",
    chain: ["TEA GIFT"],
  },
  {
    eyebrow: "Current Journey",
    title: "The experience leaves the brand.",
    body: "제품 상세 이후 사용자는 외부 선물 서비스로 이동합니다. 선물을 고르고, 메시지를 만들고, 전달하는 핵심 경험은 누데이크 밖에서 진행됩니다.",
    chain: ["TEA GIFT", "PRODUCT DETAIL"],
  },
  {
    eyebrow: "Break Point",
    title: "거래는 이어지지만, 누데이크의 경험은 여기서 멈춥니다.",
    body: "Gift를 단순 구매 경로가 아니라, 브랜드 안에서 직접 구성하고 완성하는 경험으로 확장할 필요가 있습니다.",
    chain: ["TEA GIFT", "PRODUCT DETAIL", "KAKAO GIFT ↗"],
  },
];

const NOTES: {
  eyebrow: string;
  title: string;
  body: string;
  chain?: string[];
}[] = [
  {
    eyebrow: "Design Direction",
    title: "Keep the gift inside NUDAKE",
    body: "외부 서비스로 이어지던 선물 과정을 NUDAKE 안으로 가져옵니다. 티를 고르고, 메시지를 작성하고, 직접 구성해 전달하기까지 하나의 브랜드 경험으로 연결합니다.",
  },
  {
    eyebrow: "Proposed Flow",
    title: "From discovery to completion",
    body: "제품을 발견한 뒤 구매로 이동하는 흐름을 넘어, 사용자가 직접 선물을 구성하고 완성하는 과정으로 확장합니다.",
    chain: ["CHOOSE TEA", "WRITE POSTCARD", "COMPOSE", "PREVIEW", "SEND"],
  },
  {
    eyebrow: "Core Interaction",
    title: "Write it. Place it. Complete it.",
    body: "메시지를 쓰고, 선물 안에 직접 배치하는 행동을 통해 사용자가 하나의 Gift를 완성합니다.",
    chain: ["WRITE POSTCARD", "PLACE IN GIFT", "COMPLETE"],
  },
];

function Chain({ steps }: { steps: string[] }) {
  return (
    <p className="nud-chain">
      {steps.map((step, n) => (
        <span key={step} className="contents">
          {n > 0 ? <i aria-hidden>→</i> : null}
          <span
            className="flow-pill"
            data-tone={
              FILLED.has(step) || step.startsWith("KAKAO") ? "start" : undefined
            }
          >
            {step}
          </span>
        </span>
      ))}
    </p>
  );
}

export function SceneNudakeGap4() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  /** 펼쳐 둔 카드. 한 번에 하나만 열립니다. */
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen((now) => (now === i ? null : i));

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 새 화면이 나오면 이 안의 것만 갈아 끼우면 됩니다. 지금은 앞 장과 같은 화면입니다. */}
      <div
        className="nud-stage col-start-1 col-span-4 row-start-2 row-span-6"
        aria-hidden
      >
        <NudakeMockList />
      </div>

      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        From Buying a Gift
        <br />
        to Making One.
      </h2>

      <div
        className="nud-notes col-start-5 col-span-4 row-start-2 row-span-5"
        data-spread
      >
        {NOTES.map((note, i) => (
          <div
            key={note.eyebrow}
            className="note nud-ruled rise"
            data-open={open === i || undefined}
            style={{ "--delay": `${0.12 + i * 0.1}s` } as CSSProperties}
          >
            <button
              type="button"
              className="nud-open"
              aria-expanded={open === i}
              aria-label={`${note.eyebrow} — 앞 장의 글과 견주어 보기`}
              onClick={() => toggle(i)}
            >
              <i aria-hidden />
            </button>

            <p className="nud-eyebrow">{note.eyebrow}</p>
            <h3 className="type-title">{note.title}</h3>
            {note.body ? <p className="type-body">{note.body}</p> : null}
            {note.chain ? <Chain steps={note.chain} /> : null}

            {/* 앞 장의 같은 자리 글. 접혀 있다가 꺾쇠를 누르면 열립니다. */}
            <div className="nud-was">
              <div className="nud-was-in">
                <p className="nud-eyebrow">Before &middot; {BEFORE[i].eyebrow}</p>
                <h4 className="type-title">{BEFORE[i].title}</h4>
                <p className="type-body">{BEFORE[i].body}</p>
                <Chain steps={BEFORE[i].chain} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
