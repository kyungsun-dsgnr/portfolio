"use client";

/** 15장 — 지금의 경험. 실제 화면을 지나는 순서대로 늘어놓습니다. */

import type { CSSProperties } from "react";

/* 실제 화면 목업은 잠시 내려 두었습니다. 다시 붙이려면 아래 넷을 되살리면 됩니다.
   TamburinsGiftScreen / TamburinsProductScreen / TamburinsScentScreen */
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
}[] = [
  { screen: "Gift", step: "Browse", row: 3 },
  { screen: "Product", step: "Enter", row: 4, above: true },
  { screen: "Scent 1 / 2", step: "Select", row: 3 },
  /* 넷째 칸도 같은 1/2 단계입니다. 고르고 난 뒤, 못 고르는 향이 흐려진 상태입니다. */
  {
    screen: "Scent 1 / 2",
    step: "Select",
    row: 4,
    above: true,
  },
];

const px = (value: number) => `calc(${value} * var(--u))`;

/**
 * 화면 넷이 왼쪽에서 오른쪽으로, 조금씩 내려가며 놓입니다.
 * 나란히 세우는 것보다 여러 화면을 통과한다는 인상이 남습니다.
 */
export function SceneScreens() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

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
              <span>{shot.screen}</span>
            </div>
            {/* 화면 이름은 Current User Flow 의 마디와 같은 말을 씁니다.
                아래 한 줄은 그 화면에서 하는 일입니다. */}
            <div className="steps-cap">
              <h3 className="steps-step">{shot.screen}</h3>
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
