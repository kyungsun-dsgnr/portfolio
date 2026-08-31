"use client";

/** 15장 — 지금의 경험. 실제 화면을 지나는 순서대로 늘어놓습니다. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { TamburinsGiftScreen } from "@/components/TamburinsGiftScreen";
import { TamburinsProductScreen } from "@/components/TamburinsProductScreen";
import { TamburinsBagScreen } from "@/components/TamburinsBagScreen";
import { TamburinsScentScreen } from "@/components/TamburinsScentScreen";
import { useInView } from "@/components/useInView";

/* 자리는 전부 그리드에서 끌어옵니다.
   화면 하나가 두 단이라 젠틀몬스터 장의 목업과 같은 폭(333)이고,
   화면 사이가 그리드 간격, 내려앉는 높이도 간격 하나입니다.
   그래서 넷이 1·3·5·7단에서 시작해 마지막 오른쪽이 판 끝과 맞습니다. */
const COL = 158.5;
const GAP = 16;
/** 화면 하나. 두 단 폭이고, 높이는 판에 맞춰 위쪽만 보이도록 자릅니다. */
const SHOT_W = 2 * COL + GAP;
const SHOT_H = 400;
/** 한 걸음 옮길 때마다 오른쪽으로 두 단 */
const STEP_X = 2 * (COL + GAP);
/** 첫 단에서 시작합니다. */
const START_X = 0;
/** 한 행 높이. 내려앉는 높이를 행으로 셉니다. */
const ROW = 110;
/** 화면들이 놓이는 판이 시작하는 행과, 그 판의 높이(3~6행) */
const BAND_ROW = 3;
const BAND_H = 4 * ROW + 3 * GAP;

/* 사용자가 지나는 순서. 분석은 다음 장에서 하고 여기서는 있는 그대로 둡니다.
   row 는 그 화면이 시작하는 행이고, 한 행씩 엇갈려 지나온 걸음이 보입니다.
   내려앉은 화면은 판 밖으로 흘러 아래에 마디를 놓을 자리가 없어 위에 답니다. */
const SHOTS: {
  screen: string;
  step: string;
  row: number;
  above?: boolean;
  real?: "gift" | "product" | "scent1" | "bag";
}[] = [
  { screen: "Gift", step: "Browse", row: 3, real: "gift" },
  { screen: "Product", step: "Enter", row: 4, above: true, real: "product" },
  { screen: "Scent 1 / 2", step: "Select", row: 3, real: "scent1" },
  /* 넷째 칸도 같은 1/2 단계입니다. 고르고 난 뒤, 못 고르는 향이 흐려진 상태입니다. */
  {
    screen: "Add to Bag",
    step: "Confirm",
    row: 4,
    above: true,
    real: "bag",
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

/**
 * 화면 넷이 왼쪽에서 오른쪽으로, 조금씩 내려가며 놓입니다.
 * 나란히 세우는 것보다 여러 화면을 통과한다는 인상이 남습니다.
 */
export function SceneScreens() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  /* 향 선택 창이 1/2 에서 2/2 로 넘어가면 그 칸의 마디도 같이 바뀝니다. */
  const [scentStep, setScentStep] = useState<1 | 2>(1);
  const onStep = useCallback((step: 1 | 2) => setScentStep(step), []);

  /* 한 번에 한 칸만 움직입니다. 그 칸이 제 과정을 마치면 다음 칸으로 넘어가고,
     나머지는 물러나 있습니다. 손으로 칸을 누르면 그 칸부터 다시 봅니다. */
  const [active, setActive] = useState(0);
  const at = useRef(0);

  /* 칸마다 몇 번째로 보는지 세어 둡니다. 이 수가 바뀔 때만 화면이 새로 서고,
     물러난 칸은 그대로 두어 마지막 장면에서 멈춰 있습니다. */
  const [plays, setPlays] = useState<number[]>(() => SHOTS.map(() => 0));

  const start = useCallback((to: number) => {
    at.current = to;
    setActive(to);
    /* 향 선택 창은 다시 볼 때마다 1/2 부터입니다. */
    if (to === 2) setScentStep(1);
    setPlays((seen) => seen.map((n, i) => (i === to ? n + 1 : n)));
  }, []);

  useEffect(() => {
    if (inView) return;
    /* 장을 벗어나면 네 칸 모두 처음으로 돌려 둡니다. */
    const back = window.setTimeout(() => {
      at.current = 0;
      setActive(0);
      setScentStep(1);
      setPlays((seen) => seen.map((n) => n + 1));
    }, 0);
    return () => clearTimeout(back);
  }, [inView]);

  /* 제 과정을 마친 칸은 그 자리에 멈춘 채 다음 칸에 차례를 넘깁니다. */
  const advance = useCallback(
    (from: number) => {
      if (at.current === from) start(from + 1);
    },
    [start],
  );

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        One gift,
        <br />
        across multiple screens.
      </h2>

      <div className="steps col-start-1 col-span-8 row-start-3 row-span-4">
        {SHOTS.map((shot, i) => (
          <div
            key={`${shot.screen}-${i}`}
            className="steps-shot rise"
            data-above={shot.above || undefined}
            /* 물러나 있는 칸은 눌러서 다시 볼 수 있습니다. */
            data-idle={active !== i || undefined}
            role="button"
            tabIndex={0}
            onClick={() => start(i)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                start(i);
              }
            }}
            style={
              {
                left: px(START_X + i * STEP_X),
                top: px((shot.row - BAND_ROW) * (ROW + GAP)),
                width: px(SHOT_W),
                /* 한 화면씩 차례로 들어와, 지나가는 순서가 눈에 먼저 남습니다. */
                "--delay": `${0.16 + i * 0.14}s`,
              } as CSSProperties
            }
          >
            {/* 실제 화면이 들어갈 자리. 내려앉은 만큼 짧아져 판 밖으로 넘지 않습니다. */}
            <div
              className="steps-frame"
              style={{
                height: px(
                  Math.min(
                    SHOT_H,
                    BAND_H - (shot.row - BAND_ROW) * (ROW + GAP),
                  ),
                ),
              }}
            >
              {shot.real === "gift" && (
                <TamburinsGiftScreen
                  key={plays[i]}
                  run={inView && active === i}
                  onDone={() => advance(i)}
                />
              )}
              {shot.real === "product" && (
                <TamburinsProductScreen
                  key={plays[i]}
                  run={inView && active === i}
                  onDone={() => advance(i)}
                />
              )}
              {shot.real === "scent1" && (
                <TamburinsScentScreen
                  key={plays[i]}
                  onStep={onStep}
                  run={inView && active === i}
                  onDone={() => advance(i)}
                />
              )}
              {shot.real === "bag" && (
                <TamburinsBagScreen
                  key={plays[i]}
                  run={inView && active === i}
                />
              )}
              {!shot.real && <span>{shot.screen}</span>}
            </div>
            {/* 화면 이름은 Current User Flow 의 마디와 같은 말을 씁니다.
                아래 한 줄은 그 화면에서 하는 일입니다. */}
            <div className="steps-cap">
              {/* 몇 번째 걸음인지 */}
              <p className="steps-no">{`STEP ${String(i + 1).padStart(2, "0")}`}</p>
              <h3 className="steps-step">
                {shot.real === "scent1"
                  ? `Scent ${scentStep} / 2`
                  : shot.screen}
              </h3>
              <p className="steps-kind">{shot.step}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 제목 맞은편, 화면이 시작되기 전 자리에 한 문장을 둡니다. */}
      <p
        className="type-body rise col-start-6 col-span-3 row-start-1"
        style={{ "--delay": "0.24s" } as CSSProperties}
      >
        세트 구성과 향 선택이 서로 다른 화면에 나뉘어 순차적으로 진행됩니다.
      </p>
    </div>
  );
}
