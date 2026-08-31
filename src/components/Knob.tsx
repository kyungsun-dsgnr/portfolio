"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";

/** 0 = 12시 방향, 최대값 = 시계방향으로 한 바퀴 돌아 다시 12시 */
const SWEEP = 360;
/** SVG 원(r=46)의 둘레. 아크 길이를 stroke-dasharray 로 자를 때 씁니다. */
const CIRCUMFERENCE = 2 * Math.PI * 46;
/** 키보드 한 번에 움직이는 양 */
const STEP = 0.05;
/** 중심에 가까우면 각도가 불안정해서(1px만 움직여도 크게 흔들림) 값을 바꾸지 않습니다. */
const DEAD_ZONE = 0.2;
/** 이벤트 하나가 밀 수 있는 최대 회전각. 튀는 좌표가 값을 통째로 옮기는 것을 막습니다. */
const MAX_STEP_ANGLE = 90;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * 노브 중심에서 본 포인터의 각도와 거리.
 * 각도는 12시를 0°로 두고 시계방향으로 증가하고, 거리는 반지름 대비 비율입니다.
 */
function pointerPolar(el: HTMLElement, clientX: number, clientY: number) {
  const box = el.getBoundingClientRect();
  const dx = clientX - (box.left + box.width / 2);
  const dy = clientY - (box.top + box.height / 2);

  return {
    angle: (Math.atan2(dx, -dy) * 180) / Math.PI,
    distance: Math.hypot(dx, dy) / (box.width / 2),
  };
}

type Props = {
  /** 0~1 */
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
};

/* 도트 매트릭스 숫자판. 5칸 × 7줄 격자에 불이 들어온 자리만 진하게 찍습니다.
   기성 폰트로는 이 결이 나오지 않아 자리표를 직접 들고 그립니다. */
const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  "%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
};

/** 글자 사이에 비워 두는 칸 수 */
const GLYPH_GAP = 2;

/** 숫자를 도트로 찍어 냅니다. 꺼진 자리도 아주 옅게 남겨 액정처럼 보이게 합니다. */
function DotNumber({ text }: { text: string }) {
  const chars = [...text].filter((c) => c in GLYPHS);
  const w = chars.length * 5 + (chars.length - 1) * GLYPH_GAP;

  return (
    <svg
      className="knob-read"
      viewBox={`-0.5 -0.5 ${w} 7`}
      aria-hidden
      style={{ width: `calc(${w * 2.3} * var(--u))` }}
    >
      {chars.map((c, i) =>
        GLYPHS[c].map((row, y) =>
          [...row].map((on, x) => (
            <circle
              key={`${i}-${y}-${x}`}
              cx={i * (5 + GLYPH_GAP) + x}
              cy={y}
              r="0.36"
              data-on={on === "1" || undefined}
            />
          )),
        ),
      )}
    </svg>
  );
}

export function Knob({ value, onChange, ariaLabel = "조명 밝기" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  /** 드래그 중 직전 각도와 누적값. 12시를 넘어가도 튀지 않게 각도 차이를 더해 나갑니다. */
  const drag = useRef<{ angle: number; value: number } | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(event.pointerId);
    el.focus();
    // Chrome 은 tabindex 가 있는 요소를 마우스로 눌러도 :focus-visible 로 봅니다.
    // 포인터로 들어왔다고 표시해 두고 CSS 에서 링을 지웁니다. 키보드로 오면 다시 보입니다.
    el.dataset.pointer = "";
    drag.current = {
      angle: pointerPolar(el, event.clientX, event.clientY).angle,
      value,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    const state = drag.current;
    if (!el || !state) return;

    const { angle, distance } = pointerPolar(el, event.clientX, event.clientY);

    let delta = angle - state.angle;
    // 12시를 넘어갈 때 359°→1° 같은 점프가 생기지 않게 -180~180 으로 정규화합니다.
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // 각도는 항상 따라가되, 중심 근처이거나 한 번에 너무 크게 튄 값은 반영하지 않습니다.
    state.angle = angle;
    if (distance < DEAD_ZONE || Math.abs(delta) > MAX_STEP_ANGLE) return;

    state.value = clamp(state.value + delta / SWEEP);
    onChange(state.value);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    ref.current?.releasePointerCapture(event.pointerId);
    drag.current = null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // 키보드로 조작하기 시작하면 포커스 링을 다시 보여 줍니다.
    delete ref.current?.dataset.pointer;

    const step: Record<string, number> = {
      ArrowUp: STEP,
      ArrowRight: STEP,
      ArrowDown: -STEP,
      ArrowLeft: -STEP,
    };

    if (event.key in step) {
      event.preventDefault();
      onChange(clamp(value + step[event.key]));
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(0);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(1);
    }
  }

  const percent = Math.round(value * 100);

  return (
    <div className="knob-panel">
      <div
        ref={ref}
        className="knob"
        /* 아직 돌리지 않았을 때만 불빛이 숨 쉬듯 깜빡여 손이 가게 합니다. */
        data-idle={value === 0 ? "" : undefined}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onBlur={(event) => delete event.currentTarget.dataset.pointer}
      >
        <svg className="knob-arc" viewBox="0 0 100 100" aria-hidden>
          <circle className="knob-arc-track" cx="50" cy="50" r="46" />
          {/* 아직 돌리지 않았을 때, 불이 켜질 링 전체가 옅게 밝아졌다 잦아듭니다.
              한 번 돌리면 값 아크가 그 자리를 이어받으므로 지웁니다. */}
          {value === 0 && (
            <circle className="knob-arc-hint" cx="50" cy="50" r="46" />
          )}
          <circle
            className="knob-arc-value"
            cx="50"
            cy="50"
            r="46"
            strokeDasharray={`${((value * SWEEP) / 360) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          />
        </svg>

        <div className="knob-rim" />
        <div className="knob-cap" />

        {/* 캡 한가운데에서 지금 밝기를 읽습니다. 캡과 달리 돌지 않습니다. */}
        <DotNumber text={`${percent}%`} />

        {/* 눈금은 캡 위에 얹혀 값에 따라 돕니다. 캡 자체는 원형이라 회전이 보이지 않습니다. */}
        <div
          className="knob-marker"
          style={{ transform: `rotate(${value * SWEEP}deg)` }}
        >
          <span />
        </div>
      </div>
    </div>
  );
}
