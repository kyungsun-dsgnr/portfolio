"use client";

/**
 * 21장 — 선물로 가는 길 (변주, 네 걸음)
 *
 * 카드마다 글판 위에 진행 막대가 놓입니다 — 08장 `Beyond Store Search` 의 것과
 * 같은 결(1px 선 위로 채워지는 막대)입니다. 막대가 다 차면 다음 걸음으로 넘어가고,
 * 눌러도 넘어갑니다. 지금 걸음의 카드만 한 행 더 자라고,
 * 막대가 거의 다 찰 무렵 그 걸음에서 눌리는 자리가 한 번 커집니다.
 *
 * 24장을 그대로 복제한 장입니다. 여기서 다음 변주를 잡습니다.
 *
 * 판은 6장 `Three Directions` 와 같습니다 —
 * 제목 1–3단 1–2행 · 본문 5–8단 1–2행 · 카드 셋 3–4 / 5–6 / 7–8단 3–6행.
 *
 * 카드 글은 2장의 STEP 라벨과 같은 세 단(steps-no · steps-step · steps-kind)을 씁니다.
 * 세 걸음은 2026-09-01 nudake.com/kr 에서 직접 지난 경로입니다.
 * 그림 자리는 아직 비어 있어, 채울 것이 정해지면 넣습니다.
 */

import { useEffect, useState, type CSSProperties } from "react";

import { NudakeMockList, NudakeMockMenu } from "@/components/NudakeScreens";
import { useInView } from "@/components/useInView";

/* 홈에서 선물 상세까지 직접 밟아 센 수입니다 (2026-09-01, nudake.com/kr). */
const COUNTS = [
  { value: "6", unit: "clicks" },
  { value: "4", unit: "steps" },
  { value: "3rd", unit: "menu depth" },
];

const SIGNS = [
  {
    index: "00",
    title: "Home Entry",
    body: "NUDAKE 웹사이트에 진입",
    place: "col-start-1 col-span-2",
    screen: "home",
    tap: "hamburger" as const,
  },
  {
    index: "01",
    title: "Menu Entry",
    body: "선물 메뉴를 찾기 위해 탐색 시작",
    place: "col-start-3 col-span-2",
    screen: "menu",
    tap: "menu" as const,
  },
  {
    index: "02",
    title: "Category Depth",
    body: "하위 카테고리를 다시 선택",
    place: "col-start-5 col-span-2",
    screen: "open",
    tap: "teahouse" as const,
  },
  {
    index: "03",
    title: "Hidden Gift",
    body: "세 번째 화면에서 Gift 발견",
    place: "col-start-7 col-span-2",
    screen: "list",
    tap: "teagift" as const,
  },
];

/** 지금 걸음의 막대가 채워지는 데 걸리는 시간 */
const DWELL = 4600;

export function SceneNudakeSigns2() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 저 혼자 돌지 않습니다. 제목 옆의 재생을 눌러야 첫 걸음부터 훑습니다. */
  const [playing, setPlaying] = useState(false);

  /** 지금 밟고 있는 걸음. 재생 중이 아니면 손으로 고른 것만 섭니다. */
  const [at, setAt] = useState(0);
  /** 손으로 하나만 골라 둔 것. 재생과 따로 놉니다. */
  const [solo, setSolo] = useState<number | null>(null);
  const live = playing ? at : (solo ?? -1);

  const play = () => {
    setPlaying(true);
    setSolo(null);
    setAt(0);
  };

  const stop = () => {
    setPlaying(false);
    setSolo(null);
    setAt(0);
  };

  /* 카드를 누르면 처음부터 다시 돌지 않고 그 걸음만 섭니다. */
  const pick = (i: number) => {
    setPlaying(false);
    setSolo((now) => (now === i ? null : i));
  };

  /* 막대가 다 차면 다음 걸음으로. 마지막까지 가면 멈추고 처음으로 돌아갑니다. */
  useEffect(() => {
    if (!inView || !playing) return;
    const id = window.setTimeout(() => {
      if (at === SIGNS.length - 1) {
        setPlaying(false);
        setAt(0);
        return;
      }
      setAt((now) => now + 1);
    }, DWELL);
    return () => clearTimeout(id);
  }, [at, inView, playing]);

  /* 장을 벗어나면 처음으로 돌려 둡니다. */
  useEffect(() => {
    if (inView) return;
    const back = window.setTimeout(() => {
      setPlaying(false);
      setSolo(null);
      setAt(0);
    }, 0);
    return () => clearTimeout(back);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="page-grid"
      /* 하나가 서 있을 때만 나머지 화면이 물러납니다. */
      data-live={live >= 0 || undefined}
      data-visible={inView || undefined}
    >
      {/* 한 줄로 서려면 네 단으로는 좁아, 여섯 단을 씁니다. 카드는 3행부터라 겹치지 않습니다. */}
      <h2 className="type-lead capitalize rise col-start-1 col-span-6 row-start-1">
        Already There, Just Not Visible
        {/* 순서대로 훑어 보여 주는 장치. 제목 끝에 붙어 섭니다.
            도는 동안에는 멈춤 단추가 됩니다. */}
        <button
          type="button"
          className="store-play store-play-mid"
          data-playing={playing || undefined}
          aria-label={playing ? "훑기 멈추기" : "걸음 훑어 보기"}
          onClick={playing ? stop : play}
        >
          <span className="store-play-key">
            <svg viewBox="0 0 24 24" aria-hidden>
              {playing ? (
                <rect x="5" y="5" width="14" height="14" />
              ) : (
                <path d="M8 5 19 12 8 19 Z" />
              )}
            </svg>
          </span>

          <span className="store-play-tip" data-side="right" aria-hidden>
            {playing ? "Stop" : "Play"}
          </span>
        </button>
      </h2>

      {/* 오른쪽 끝 두 단, 제목과 같은 행에 그 길의 길이를 숫자로 세웁니다. */}
      <p
        className="nud-counts rise self-start col-start-7 col-span-2 row-start-1"
        data-tight
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        {COUNTS.map((count) => (
          <span key={count.unit + count.value}>
            <b>{count.value}</b>
            <em>{count.unit}</em>
          </span>
        ))}
      </p>

      {/* 설명은 왼쪽 넉 단, 2행부터. 끊지 않고 한 덩이로 흐릅니다. */}
      <p
        className="type-body rise self-start col-start-1 col-span-4 row-start-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        선물 목적의 사용자는 NUDAKE 안에 도착해도, ‘Gift’를 발견하기까지 메뉴
        구조를 여러 번 거쳐야 합니다. 기능은 존재하지만 탐색 흐름 안에서 충분히
        드러나지 않습니다.
      </p>

      {SIGNS.map((sign, i) => (
        <button
          type="button"
          key={sign.index}
          className={`work nud-cap-card rise self-end row-start-3 row-span-4 ${sign.place}`}
          data-on={i === live || undefined}
          aria-label={`${sign.title} 만 보기`}
          onClick={() => pick(i)}
          style={
            {
              "--delay": `${0.2 + i * 0.08}s`,
              "--dwell": `${DWELL}ms`,
              /* 막대가 거의 다 찰 무렵 손끝이 닿습니다. */
              "--tap-wait": `${DWELL - 900}ms`,
            } as CSSProperties
          }
        >
          {/* 화면이 카드를 통째로 쓰고, 글 셋은 그 아래쪽 밝은 판 위에 얹힙니다.
              글자 크기는 2장 `STEP 01 / Gift / 목록에서…` 와 같은 세 단입니다. */}
          <div className="work-visual">
            {sign.screen === "list" ? (
              <NudakeMockList tap={i === live ? "teagift" : undefined} />
            ) : (
              <NudakeMockMenu
                menu={sign.screen !== "home"}
                open={sign.screen === "open"}
                hero={
                  sign.screen === "home" ? "/images/nudake-home.png" : undefined
                }
                tap={
                  i === live && sign.tap !== "teagift"
                    ? (sign.tap as "hamburger" | "menu" | "teahouse")
                    : undefined
                }
              />
            )}

            <div className="nud-cap">
              {/* 글판 위에 걸친 진행 막대. 지난 걸음은 차 있고, 지금 걸음이 채워집니다. */}
              <span
                className="step"
                data-state={
                  playing
                    ? i < at
                      ? "done"
                      : i === at
                        ? "now"
                        : undefined
                    : undefined
                }
                aria-hidden
              >
                <span className="step-fill" />
              </span>

              <p className="steps-no">STEP {sign.index}</p>
              <h3 className="steps-step">{sign.title}</h3>
              <p className="steps-kind">{sign.body}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
