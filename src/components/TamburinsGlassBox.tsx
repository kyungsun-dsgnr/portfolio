"use client";

/** 13장 — 유리로 된 선물 상자. 담긴 것이 앞면 너머로 비칩니다. */

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 상자 도면의 좌표계. 선으로 그린 상자와 같은 자리를 씁니다. */
const W = 663;
const H = 643;

/** 도면 좌표를 clip-path 다각형으로 옮깁니다. */
const clip = (points: [number, number][]) =>
  `polygon(${points
    .map(
      ([x, y]) =>
        `${((x / W) * 100).toFixed(2)}% ${((y / H) * 100).toFixed(2)}%`,
    )
    .join(", ")})`;

/* 상자를 이루는 다섯 면 */
const FACES = {
  inner: clip([
    [61, 396],
    [601, 396],
    [596, 481],
    [66, 481],
  ]),
  lid: clip([
    [71, 41],
    [591, 41],
    [601, 396],
    [61, 396],
  ]),
  flap: clip([
    [61, 1],
    [601, 1],
    [591, 41],
    [71, 41],
  ]),
  front: clip([
    [1, 501],
    [16, 631],
    [646, 631],
    [661, 501],
  ]),
  top: clip([
    [61, 396],
    [601, 396],
    [661, 501],
    [1, 501],
  ]),
};

/* 담기는 것들. 밑동이 같은 선(y 576)에 닿고, 앞면 유리 너머로 비쳐 보입니다. */
const GOODS = [
  {
    id: "wash",
    src: "/images/tamburins-handwash.png",
    left: 371,
    top: 192,
    width: 132,
    height: 384,
    tilt: "5.5deg",
    delay: "0.34s",
  },
  {
    id: "perfume",
    src: "/images/tamburins-perfume.png",
    left: 160,
    top: 382,
    width: 193,
    height: 194,
    tilt: "-11deg",
    delay: "0s",
  },
];

const pc = (value: number, of: number) => `${(value / of) * 100}%`;

/**
 * 유리 상자. 면마다 뒤가 비치고, 앞면 너머로 담긴 것의 밑동이 흐리게 남습니다.
 * 뚜껑이 열리고 담기는 순서는 선으로 그린 상자와 같습니다.
 */
export function TamburinsGlassBox() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState(false);
  const timers = useRef<number[]>([]);

  function clear() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => {
    clear();
    if (!inView) {
      timers.current.push(
        window.setTimeout(() => {
          setOpen(false);
          setPlaced(false);
        }, 0),
      );
      return clear;
    }
    timers.current.push(window.setTimeout(() => setOpen(true), 420));
    timers.current.push(window.setTimeout(() => setPlaced(true), 1460));
    return clear;
  }, [inView]);

  return (
    <div ref={ref} className="gift glass">
      <div className="gift-stage" data-open={open || undefined}>
        {/* 상자 안쪽 */}
        <span className="glass-face" style={{ clipPath: FACES.inner }} />

        {/* 뚜껑 — 뒤쪽 모서리를 축으로 돕니다 */}
        <div className="gift-lid">
          <span
            className="glass-face glass-lid"
            style={{ clipPath: FACES.lid }}
          />
          <svg className="gift-layer" viewBox={`0 0 ${W} ${H}`} aria-hidden>
            <g className="gift-ink">
              <path d="M71 41 H591 L601 396 H61 Z" />
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
            <text className="gift-mark gift-sub" x="331" y="252">
              PERFUME
            </text>
          </svg>

          {/* 자석이 붙는 앞 날개 */}
          <div className="gift-flap">
            <span
              className="glass-face glass-flap"
              style={{ clipPath: FACES.flap }}
            />
            <svg className="gift-layer" viewBox={`0 0 ${W} ${H}`} aria-hidden>
              <g className="gift-ink">
                <path d="M61 1 H601 L591 41 H71 Z" />
              </g>
            </svg>
          </div>
        </div>

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
              <span className="gift-lift">
                <Image
                  alt=""
                  src={one.src}
                  fill
                  sizes="30vw"
                  className="object-contain"
                />
              </span>
            </span>
          ))}
        </div>

        {/* 상자 앞면. 유리라 담긴 것의 밑동이 흐리게 비칩니다. */}
        <span
          className="glass-face glass-front"
          style={{ clipPath: FACES.front }}
        />

        {/* 닫힌 상자의 윗면 */}
        <span
          className="glass-face glass-top"
          style={{ clipPath: FACES.top }}
        />

        {/* 모서리 선. 유리의 가장자리만 얇게 남깁니다. */}
        <svg
          className="gift-layer glass-edge"
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden
        >
          <g className="gift-ink">
            <path d="M61 396 H601 L596 481 H66 Z" />
            <path d="M61 396 L1 501" />
            <path d="M601 396 L661 501" />
            <path d="M1 501 L16 631 H646 L661 501 Z" />
            <path d="M16 631 L9 641" />
            <path d="M646 631 L652 641" />
            <path d="M9 641 H653" />
          </g>
        </svg>
      </div>
    </div>
  );
}
