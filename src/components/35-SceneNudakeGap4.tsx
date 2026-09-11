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

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

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

/* 첫 카드를 누르면 왼쪽(고치기 전) 화면이 밟는 차례 —
   목록에서 하나를 고르고 · 상세로 넘어가고 · 단추가 보이게 내려서 · 누르면
   브랜드 밖 화면이 서고 · 색이 빠지며 끝납니다. 34장과 같은 박자입니다.
   그 뒤 화면이 한 행 내려앉고, 오른쪽(고친 뒤) 화면이 고르기부터 돕니다. */
const TAP_AT = 1200;
const TURN_AT = 2100;
const DOWN_AT = 3100;
const PUSH_AT = 4100;
const AWAY_AT = 4900;
const GONE_AT = 5900;
const SINK_AT = 6700;
const AFTER_AT = 7300;

/* 카드마다 도는 길이(ms) — 위 보더의 막대가 이 시간에 맞춰 차오르고,
   재생 단추로 훑을 때는 이 시간이 지나면 다음 카드로 넘어갑니다.
   첫 카드: 왼쪽 7.3초 + 오른쪽이 고르기부터 보내기까지 약 13초.
   둘째: 왼쪽이 두 번 넘기고 오른쪽이 바꿔 담기까지. 셋째: 글을 넣고 보내기까지. */
const SPAN = [20600, 5400, 8400];

/* 오른쪽 화면의 키 — 2행 머리부터 6행 끝까지(다섯 행과 사이 넷).
   바닥 단추까지 다 보이게, 화면을 그 키로 세웁니다. */
const STAGE_H = 5 * 110 + 4 * 16;

/* 둘째 카드가 바꿔 담는 칸 — 넷째, 루스 리프 에디션. 처음의 아카이브와 다른 제품입니다. */
const OTHER_PICK = 3;

/* 둘째 카드를 누르면 왼쪽(고치기 전) 상세가 밟는 차례 —
   아카이브 상세에서 바닥의 `다음 제품` 을 두 번 눌러 루스 리프 에디션까지 가고,
   그제야 오른쪽이 제품 줄에서 같은 제품으로 바꿔 담습니다. */
const NEXT1_AT = 900;
const TURN1_AT = 1300;
const NEXT2_AT = 2100;
const TURN2_AT = 2500;
const SWAP_AT = 3300;

export function SceneNudakeGap4({ pair = false }: { pair?: boolean } = {}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const { c } = useCopy();

  /** 펼쳐 둔 카드. 한 번에 하나만 열립니다. 열리면 그 카드의 장면이 돕니다. */
  const [open, setOpen] = useState<number | null>(null);
  /* 누르면 붙잡힙니다 — 붙잡힌 카드는 손이 오가도 바뀌지 않고, 한 번 더 누르면 놓입니다. */
  const [held, setHeld] = useState(false);
  /** 재생 단추로 셋을 차례로 훑는 중인지 */
  const [auto, setAuto] = useState(false);
  /** 카드를 열 때마다 하나씩 올립니다 — 막대가 처음부터 다시 차오르게. */
  const [plays, setPlays] = useState<number[]>(() => NOTES.map(() => 0));
  const chain = useRef(0);

  const show = useCallback((i: number | null) => {
    setOpen(i);
    if (i !== null) setPlays((n) => n.map((k, j) => (j === i ? k + 1 : k)));
  }, []);

  /** 화면 하나만 눌러 그 화면의 전체 흐름을 돌리는 중 — 카드와는 따로 놉니다. */
  const [solo, setSolo] = useState<"before" | "after" | null>(null);
  /** 화면을 누를 때마다 하나씩 올립니다 — 오른쪽이 처음부터 다시 돌게. */
  const [soloPlays, setSoloPlays] = useState(0);

  /* 재생 — 첫 카드부터 셋을 이어 돌리고 끝나면 접습니다. */
  const play = useCallback(() => {
    window.clearTimeout(chain.current);
    setSolo(null);
    setAuto(true);
    show(0);
  }, [show]);

  const stop = useCallback(() => {
    window.clearTimeout(chain.current);
    setAuto(false);
    setOpen(null);
  }, []);

  /* 화면을 누르면 카드는 그대로 두고 그 화면의 흐름만 처음부터 돕니다.
     도는 중에 다시 누르면 멈춥니다. */
  const soloPlay = (side: "before" | "after") => {
    window.clearTimeout(chain.current);
    setAuto(false);
    setOpen(null);
    setSolo((now) => (now === side ? null : side));
    setSoloPlays((n) => n + 1);
  };

  useEffect(() => {
    if (!auto || open === null) return;
    chain.current = window.setTimeout(() => {
      if (open + 1 >= NOTES.length) {
        setAuto(false);
        setOpen(null);
        return;
      }
      show(open + 1);
    }, SPAN[open]);
    return () => window.clearTimeout(chain.current);
  }, [auto, open, show]);

  /** 왼쪽 화면의 걸음 — 0 목록 · 1 손끝 · 2 상세 · 3 내림 · 4 누름 ·
      5 밖으로 · 6 흑백 · 7 내려앉음 · 8 오른쪽이 돕니다 */
  const [was, setWas] = useState(0);

  /* 첫 카드가 열려 있는 동안 왼쪽이 돕니다. 닫히거나 장을 벗어나면 처음으로. */
  const playing = pair && open === 0;
  /* 왼쪽 화면을 눌러도 같은 흐름이 돕니다 — 다만 넘어가지 않고 흑백에서 멈춥니다. */
  const runBefore = playing || solo === "before";
  /* 둘째 카드는 왼쪽 상세가 `다음 제품` 으로 넘어가고, 오른쪽 엽서 화면은
     아래 제품 줄에서 같은 제품(루스 리프 에디션)으로 바꿔 담는 모습입니다. */
  const other = pair && open === 1;
  /* 셋째 카드는 오른쪽 엽서 화면이 `메시지 입력` 으로 글을 넣고
     `선물 보내기` 까지 가는 모습입니다. 왼쪽은 그대로 둡니다. */
  const send = pair && open === 2;
  /* 하나가 도는 동안 나머지 카드는 물러납니다. */
  const busy = playing || other || send;

  /** 둘째 카드의 걸음 — 0 아카이브 · 1 다음 누름 · 2 테이스터 · 3 다음 누름 ·
      4 루스 리프 · 5 오른쪽이 바꿔 담음 */
  const [flip, setFlip] = useState(0);

  useEffect(() => {
    if (!other || !inView) {
      const back = window.setTimeout(() => setFlip(0), 0);
      return () => clearTimeout(back);
    }
    const clock = [
      window.setTimeout(() => setFlip(1), NEXT1_AT),
      window.setTimeout(() => setFlip(2), TURN1_AT),
      window.setTimeout(() => setFlip(3), NEXT2_AT),
      window.setTimeout(() => setFlip(4), TURN2_AT),
      window.setTimeout(() => setFlip(5), SWAP_AT),
    ];
    return () => clock.forEach(clearTimeout);
  }, [other, inView]);

  /* 도는 동안 돌지 않는 쪽은 한 행 내려앉고 딤드 아래로 물러납니다 —
     첫 카드는 왼쪽이 도는 사이엔 오른쪽이, 넘어간 뒤엔 왼쪽이.
     둘째 카드는 왼쪽이 넘기는 사이엔 오른쪽이, 바꿔 담을 땐 왼쪽이.
     셋째 카드는 내내 왼쪽이. 아무것도 돌지 않을 때는 오른쪽이 물러나 있습니다. */
  const beforeOff =
    (playing && was >= 7) || (other && flip >= 5) || send || solo === "after";
  const afterOff =
    (!busy && solo !== "after") ||
    (playing && was < 8) ||
    (other && flip < 5) ||
    solo === "before";

  useEffect(() => {
    if (!runBefore || !inView) {
      const back = window.setTimeout(() => setWas(0), 0);
      return () => clearTimeout(back);
    }
    const clock = [
      window.setTimeout(() => setWas(1), TAP_AT),
      window.setTimeout(() => setWas(2), TURN_AT),
      window.setTimeout(() => setWas(3), DOWN_AT),
      window.setTimeout(() => setWas(4), PUSH_AT),
      window.setTimeout(() => setWas(5), AWAY_AT),
      window.setTimeout(() => setWas(6), GONE_AT),
      window.setTimeout(() => setWas(7), SINK_AT),
      window.setTimeout(() => setWas(8), AFTER_AT),
    ];
    return () => clock.forEach(clearTimeout);
  }, [runBefore, inView, soloPlays]);

  /* 장을 벗어나면 펼친 것도 접습니다 — 돌아왔을 때 처음부터 다시 누르게. */
  useEffect(() => {
    if (inView) return;
    const back = window.setTimeout(() => {
      window.clearTimeout(chain.current);
      setAuto(false);
      setOpen(null);
      setSolo(null);
      setHeld(false);
    }, 0);
    return () => clearTimeout(back);
  }, [inView]);

  /* 손으로 누르면 훑기는 멈추고 그 카드만 돕니다. */
  const toggle = (i: number) => {
    window.clearTimeout(chain.current);
    setAuto(false);
    setSolo(null);
    if (held && open === i) {
      setHeld(false);
      show(null);
    } else {
      setHeld(true);
      show(i);
    }
  };

  /* 손을 얹기만 해도 그 카드가 돕니다 — 붙잡은 것이 없고 훑는 중이 아닐 때. */
  const hoverIn = (i: number) => {
    if (held || auto || solo !== null) return;
    show(i);
  };
  const hoverOut = () => {
    if (held || auto) return;
    show(null);
  };

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 왼쪽은 고치기 전의 화면 — 여기서는 카카오로 나가는 것으로 끝납니다.
          두 화면을 나란히 두면 무엇이 달라졌는지 눈으로 견줄 수 있습니다.
          한 장만 세우는 판(첫 판)에서는 이 자리에 개선 화면이 섭니다. */}
      <div
        className="nud-stage col-start-1 col-span-4 row-start-2 row-span-5"
        data-sunk={beforeOff || undefined}
        data-dim={beforeOff || undefined}
      >
        {pair ? (
          other ? (
            /* 둘째 카드 — 상세에서 `다음 제품` 으로 두 번 넘어갑니다. */
            <NudakeMockDetail
              down
              item={flip >= 4 ? 3 : flip >= 2 ? 2 : 1}
              next={flip === 1 || flip === 3}
            />
          ) : was >= 5 ? (
            <NudakeMockKakao away={was >= 6} quiet />
          ) : was >= 2 ? (
            <NudakeMockDetail down={was >= 3} tap={was === 4} />
          ) : (
            <NudakeMockList gift pick={was === 1 || undefined} />
          )
        ) : (
          <NudakeMockCompose run={inView} />
        )}

        {/* 화면 어디를 눌러도 이 화면의 전체 흐름이 처음부터 돕니다. */}
        {pair && (
          <button
            type="button"
            className="nud-stage-hit"
            aria-label={
              solo === "before" ? "흐름 멈추기" : "고치기 전 흐름 재생"
            }
            onClick={() => soloPlay("before")}
          />
        )}
      </div>

      {/* 오른쪽은 고친 뒤의 화면. 처음에는 티 아카이브를 담은 엽서 화면이 서 있고,
          첫 카드면 왼쪽이 끝난 뒤 고르기부터 다시 돌고(그래서 새로 세웁니다),
          둘째 카드면 아래 제품 줄에서 다른 제품으로 바꿔 담습니다.
          자리는 CSS 가 잡습니다 — 판마다 서는 단이 다릅니다. */}
      {pair && (
        <div
          className="nud-stage nud-stage-pair"
          data-sunk={afterOff || undefined}
          data-dim={afterOff || undefined}
        >
          {was >= 8 || solo === "after" ? (
            <NudakeMockCompose key={`run-${soloPlays}`} run height={STAGE_H} />
          ) : send ? (
            /* 셋째 카드 — 엽서 앞장에서 시작해 글을 넣고 결제 시트까지. */
            <NudakeMockCompose key="send" step="note" run height={STAGE_H} />
          ) : (
            <NudakeMockCompose
              key="card"
              step="card"
              height={STAGE_H}
              swapTo={flip >= 5 ? OTHER_PICK : null}
            />
          )}

          <button
            type="button"
            className="nud-stage-hit"
            aria-label={solo === "after" ? "흐름 멈추기" : "고친 뒤 흐름 재생"}
            onClick={() => soloPlay("after")}
          />
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

        {/* 셋을 차례로 훑어 보여 주는 장치. 도는 동안에는 멈춤 단추가 됩니다. */}
        {pair && (
          <button
            type="button"
            className="store-play store-play-block"
            data-playing={auto || undefined}
            aria-label={auto ? "훑기 멈추기" : "카드 훑어 보기"}
            onClick={auto ? stop : play}
          >
            <span className="store-play-key">
              <svg viewBox="0 0 24 24" aria-hidden>
                {auto ? (
                  <rect x="5" y="5" width="14" height="14" />
                ) : (
                  <path d="M8 5 19 12 8 19 Z" />
                )}
              </svg>
            </span>

            <span className="store-play-tip" data-side="right" aria-hidden>
              {auto ? "Stop" : "Play"}
            </span>
          </button>
        )}
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
            /* 한 카드가 도는 동안 나머지는 물러납니다. */
            data-off={(busy && i !== open) || undefined}
            /* 어느 화면이 도는지 — 그쪽 글이 진하고 다른 쪽은 물러납니다. */
            data-side={
              busy && open === i
                ? (playing && was < 8) || (other && flip < 5)
                  ? "before"
                  : "after"
                : undefined
            }
            aria-expanded={open === i}
            aria-label={`${note.eyebrow} — 앞 장의 글과 견주어 보기`}
            onClick={() => toggle(i)}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") hoverIn(i);
            }}
            onPointerLeave={hoverOut}
            style={{ "--delay": `${0.12 + i * 0.1}s` } as CSSProperties}
          >
            {/* 도는 카드의 위 보더에 막대가 그 길이만큼 차오릅니다. */}
            {busy && open === i ? (
              <i
                key={plays[i]}
                className="nud-bar"
                style={{ "--fill-ms": `${SPAN[i]}ms` } as CSSProperties}
                aria-hidden
              />
            ) : null}

            <span className="nud-open" aria-hidden>
              <i />
            </span>

            {/* 앞 장의 같은 자리 글. 접혀 있다가 누르면 위에서 열립니다 —
                고치기 전이 먼저, 고친 뒤가 그 아래에 섭니다. */}
            <div className="nud-was">
              <div className="nud-was-in">
                {/* 갈래 표 — 덱 전체가 쓰는 머리말(.nud-eyebrow)과 같은 글씨입니다. */}
                <p className="nud-eyebrow nud-side">AS-IS</p>
                <p className="type-body">{BEFORE[i].body}</p>
                <Chain steps={BEFORE[i].chain} />
              </div>
            </div>

            <div className="nud-now">
              {/* 펼치면 이전 글 아래에 서므로 `TO-BE` 표를 앞에 세웁니다. */}
              {open === i ? (
                <p className="nud-eyebrow nud-side">TO-BE</p>
              ) : null}
              <p className="nud-eyebrow">{note.eyebrow}</p>
              <h3 className="type-title">{note.title}</h3>
              {note.body ? <p className="type-body">{note.body}</p> : null}
              {note.chain ? <Chain steps={note.chain} /> : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
