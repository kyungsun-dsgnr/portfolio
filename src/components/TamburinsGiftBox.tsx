"use client";

/** 12·13장 — 열리고 닫히는 선물 상자 */

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 상자 도면의 좌표계. 모든 겹이 이 안에서 같은 자리를 씁니다. */
const W = 663;
const H = 643;

/* 상자에 담기는 것들. 자리는 도면 좌표로 적고 비율로 옮깁니다.
   밑동은 앞면(y 501)에 가려지므로, 보이는 것은 그 위쪽뿐입니다. */
const GOODS = [
  {
    id: "wash",
    src: "/images/tamburins-handwash.png",
    left: 318,
    top: 232,
    width: 112,
    height: 326,
    tilt: "5.5deg",
    delay: "0.16s",
  },
  {
    id: "perfume",
    src: "/images/tamburins-perfume.png",
    left: 158,
    top: 398,
    width: 156,
    height: 157,
    tilt: "-11deg",
    delay: "0s",
  },
];

const pc = (value: number, of: number) => `${(value / of) * 100}%`;

/**
 * 뚜껑이 뒤쪽 모서리를 축으로 열리고 닫힙니다.
 * 열리면 향수와 핸드워시가 위에서 떨어져 담기고, 닫기 전에 상자 안으로 가라앉습니다.
 * 장에 들어서면 한 번 저절로 열리고, 그다음부터는 눌러서 여닫습니다.
 */
export function TamburinsGiftBox() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState(false);
  const timers = useRef<number[]>([]);

  function clear() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  /* 장에 들어서면 열고 담고, 벗어나면 처음 상태로 돌려 둡니다. */
  useEffect(() => {
    clear();
    if (!inView) {
      /* 장을 벗어나면 처음 상태로. 그리는 중에 바로 바꾸지 않고 한 박자 뒤에 둡니다. */
      timers.current.push(
        window.setTimeout(() => {
          setOpen(false);
          setPlaced(false);
        }, 0),
      );
      return clear;
    }
    timers.current.push(window.setTimeout(() => setOpen(true), 420));
    timers.current.push(window.setTimeout(() => setPlaced(true), 1180));
    return clear;
  }, [inView]);

  /* 누르면 여닫습니다. 닫을 때는 안에 든 것이 먼저 가라앉고 뚜껑이 내려옵니다. */
  function toggle() {
    clear();
    if (open) {
      setPlaced(false);
      timers.current.push(window.setTimeout(() => setOpen(false), 260));
      return;
    }
    setOpen(true);
    timers.current.push(window.setTimeout(() => setPlaced(true), 760));
  }

  return (
    <div ref={ref} className="gift">
      <button
        type="button"
        className="gift-stage"
        data-open={open || undefined}
        onClick={toggle}
        aria-label={open ? "상자 닫기" : "상자 열기"}
      >
        {/* 상자 뒤쪽 — 안쪽 벽과 바닥 */}
        <svg className="gift-layer" viewBox={`0 0 ${W} ${H}`} aria-hidden>
          <g className="gift-ink">
            <path d="M61 396 H601 L596 481 H66 Z" className="gift-fill" />
            <path d="M61 396 L1 501" />
            <path d="M601 396 L661 501" />
            <path d="M66 481 L51 501" />
            <path d="M596 481 L611 501" />
            <path d="M1 501 H661" />
          </g>
        </svg>

        {/* 담기는 것들 */}
        <div className="gift-goods">
          {GOODS.map((one) => (
            <span
              key={one.id}
              className="gift-item"
              data-in={placed || undefined}
              style={
                {
                  left: pc(one.left, W),
                  top: pc(one.top, H),
                  width: pc(one.width, W),
                  height: pc(one.height, H),
                  "--tilt": one.tilt,
                  "--delay": one.delay,
                } as CSSProperties
              }
            >
              <Image
                alt=""
                src={one.src}
                fill
                sizes="30vw"
                className="object-contain"
              />
            </span>
          ))}
        </div>

        {/* 상자 앞쪽 — 안에 든 것의 밑동을 가립니다 */}
        <svg className="gift-layer" viewBox={`0 0 ${W} ${H}`} aria-hidden>
          <g className="gift-ink">
            <path
              d="M1 501 L16 631 H646 L661 501 Z"
              className="gift-fill"
              fillRule="evenodd"
              clipRule="evenodd"
            />
            <path d="M16 631 H646" />
            <path d="M16 631 L9 641" />
            <path d="M646 631 L652 641" />
            <path d="M9 641 H653" />
          </g>
        </svg>

        {/* 닫힌 상자의 윗면. 뚜껑은 다 눕는 순간 옆에서 본 꼴이라 보이지 않으므로,
            그 자리에 이 면이 대신 들어섭니다. */}
        <svg className="gift-layer gift-top" viewBox={`0 0 ${W} ${H}`} aria-hidden>
          <g className="gift-ink">
            <path d="M61 396 H601 L661 501 H1 Z" className="gift-fill" />
          </g>
        </svg>

        {/* 뚜껑 — 뒤쪽 모서리를 축으로 돕니다 */}
        <div className="gift-lid" aria-hidden>
          <svg className="gift-layer" viewBox={`0 0 ${W} ${H}`}>
            <g className="gift-ink">
              <path d="M71 41 H591 L601 396 H61 Z" className="gift-fill" />
              <path d="M71 41 H591" />
              <path d="M61 396 H601" />
            </g>
            <image
              className="gift-mark"
              href="/images/tamburins-mark.png"
              x="176"
              y="174"
              width="311"
              height="46"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>

          {/* 자석이 붙는 앞 날개. 닫힐 때 마지막에 접힙니다. */}
          <svg className="gift-layer gift-flap" viewBox={`0 0 ${W} ${H}`}>
            <g className="gift-ink">
              <path d="M61 1 H601 L591 41 H71 Z" className="gift-fill" />
              <path d="M61 1 L71 41" />
              <path d="M601 1 L591 41" />
              <path d="M71 41 H591" />
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
}
