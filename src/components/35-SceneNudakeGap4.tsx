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

import { useEffect, useState, type CSSProperties } from "react";

import { NudakeMockCompose } from "@/components/NudakeComposeScreen";
import {
  NudakeMockDetail,
  NudakeMockKakao,
  NudakeMockList,
} from "@/components/NudakeScreens";
import { useCopy } from "@/components/copy";
import { IconArrowRight } from "@/components/Icons";
import { useInView } from "@/components/useInView";

/* 손이 닿는 걸음은 채워서 세웁니다 — 여기가 이 흐름의 몫입니다. */
const FILLED = new Set(["COMPOSE", "PLACE IN GIFT"]);

/* 앞 장(Found Here)의 같은 자리 글. 펼쳤을 때 아래에 붙습니다. */
const BEFORE = [
  {
    eyebrow: "Experience Gap",
    title: "Found in NUDAKE",
    body: "사용자는 누데이크 안에서 Tea Gift를 발견하고 제품을 확인합니다",
    chain: ["TEA GIFT"],
  },
  {
    eyebrow: "Current Journey",
    title: "The Experience Leaves the Brand",
    body: "제품 상세 이후 사용자는 외부 선물 서비스로 이동합니다. 선물을 고르고, 메시지를 만들고, 전달하는 과정은 누데이크 밖에서 진행됩니다",
    chain: ["TEA GIFT", "PRODUCT DETAIL"],
  },
  {
    eyebrow: "Break Point",
    title: "The Experience Does Not Continue in NUDAKE",
    body: "거래는 외부 서비스에서 가능하지만, 선물 경험은 누데이크 안에서 이어지지 않습니다",
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
    title: "Keep the Gift Inside NUDAKE",
    body: "외부 서비스로 이어지던 선물 과정을 NUDAKE 안으로 가져옵니다. 차를 고르고, 메시지를 작성하고, 보내기 전 확인하는 과정까지 하나의 브랜드 경험으로 연결합니다.",
  },
  {
    eyebrow: "Proposed Flow",
    title: "From Discovery to Completion",
    body: "Tea Gift를 발견한 뒤 구매로 이동하는 흐름을 넘어, 사용자가 직접 선물을 구성하고 완성하는 과정으로 확장합니다.",
    chain: ["CHOOSE TEA", "WRITE MESSAGE", "COMPOSE", "PREVIEW", "SEND"],
  },
  {
    eyebrow: "Core Interaction",
    title: "Write It. Place It. Complete It",
    body: "메시지를 쓰고, 선물 안에 배치하고, 보내기 전 완성된 장면을 확인합니다.",
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

/* 왼쪽(고치기 전) 화면이 스스로 밟는 차례 —
   목록에서 하나를 고르고 · 상세로 넘어가고 · 단추가 보이게 내려서 · 누르면
   브랜드 밖 화면이 섭니다. 34장과 같은 박자입니다. */
const TAP_AT = 1200;
const TURN_AT = 2100;
const DOWN_AT = 3100;
const PUSH_AT = 4100;
const AWAY_AT = 4900;

export function SceneNudakeGap4({ pair = false }: { pair?: boolean } = {}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const { c } = useCopy();

  /** 펼쳐 둔 카드. 한 번에 하나만 열립니다. */
  const [open, setOpen] = useState<number | null>(null);

  /** 왼쪽 화면의 걸음 — 0 목록 · 1 손끝 · 2 상세 · 3 내림 · 4 누름 · 5 밖으로 */
  const [was, setWas] = useState(0);

  useEffect(() => {
    if (!pair) return;
    if (!inView) {
      const back = window.setTimeout(() => setWas(0), 0);
      return () => clearTimeout(back);
    }
    const clock = [
      window.setTimeout(() => setWas(1), TAP_AT),
      window.setTimeout(() => setWas(2), TURN_AT),
      window.setTimeout(() => setWas(3), DOWN_AT),
      window.setTimeout(() => setWas(4), PUSH_AT),
      window.setTimeout(() => setWas(5), AWAY_AT),
    ];
    return () => clock.forEach(clearTimeout);
  }, [pair, inView]);

  const toggle = (i: number) => setOpen((now) => (now === i ? null : i));

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 왼쪽은 고치기 전의 화면 — 여기서는 카카오로 나가는 것으로 끝납니다.
          두 화면을 나란히 두면 무엇이 달라졌는지 눈으로 견줄 수 있습니다.
          한 장만 세우는 판(첫 판)에서는 이 자리에 개선 화면이 섭니다. */}
      <div
        className="nud-stage col-start-1 col-span-4 row-start-2 row-span-5"
        aria-hidden
      >
        {pair ? (
          was >= 5 ? (
            <NudakeMockKakao />
          ) : was >= 2 ? (
            <NudakeMockDetail down={was >= 3} tap={was === 4} />
          ) : (
            <NudakeMockList gift pick={was === 1 || undefined} />
          )
        ) : (
          <NudakeMockCompose run={inView} />
        )}
      </div>

      {/* 오른쪽은 고친 뒤의 화면. 장에 들어서면 엽서를 쓰고 봉투에 담습니다.
          자리는 CSS 가 잡습니다 — 판마다 서는 단이 다릅니다. */}
      {pair && (
        <div className="nud-stage nud-stage-pair" aria-hidden>
          <NudakeMockCompose run={inView} />
        </div>
      )}

      {/* 두 화면 사이의 화살표. 전과 후를 잇는 표시입니다. */}
      {pair && (
        <span className="nud-turn rise" aria-hidden>
          <IconArrowRight />
        </span>
      )}

      {/* 줄바꿈은 문구표를 지나갑니다 — 판마다 한 줄로도, 두 줄로도 섭니다. */}
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        {c("From Buying a Gift\nto Making One")}
      </h2>

      <div
        className="nud-notes col-start-5 col-span-4 row-start-2 row-span-5"
        data-spread
      >
        {/* 카드 전체가 손잡이입니다 — 꺾쇠만이 아니라 어디를 눌러도
            앞 장의 글이 열립니다. 안에는 누를 것이 따로 없어
            단추 안에 단추가 생기지 않습니다. */}
        {NOTES.map((note, i) => (
          <button
            type="button"
            key={note.eyebrow}
            className="note nud-ruled rise"
            data-open={open === i || undefined}
            aria-expanded={open === i}
            aria-label={`${note.eyebrow} — 앞 장의 글과 견주어 보기`}
            onClick={() => toggle(i)}
            style={{ "--delay": `${0.12 + i * 0.1}s` } as CSSProperties}
          >
            <span className="nud-open" aria-hidden>
              <i />
            </span>

            <p className="nud-eyebrow">{note.eyebrow}</p>
            <h3 className="type-title">{note.title}</h3>
            {note.body ? <p className="type-body">{note.body}</p> : null}
            {note.chain ? <Chain steps={note.chain} /> : null}

            {/* 앞 장의 같은 자리 글. 접혀 있다가 꺾쇠를 누르면 열립니다. */}
            <div className="nud-was">
              <div className="nud-was-in">
                <p className="nud-eyebrow">
                  Before &middot; {BEFORE[i].eyebrow}
                </p>
                <h4 className="type-title">{BEFORE[i].title}</h4>
                <p className="type-body">{BEFORE[i].body}</p>
                <Chain steps={BEFORE[i].chain} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
