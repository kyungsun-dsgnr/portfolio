"use client";

/** 10장 — 제안 화면 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { StoreGlobeMock } from "@/components/StoreGlobeMock";
import { useInView } from "@/components/useInView";

/** 한 칸이 머무는 시간 */
const DWELL = 5500;
/** 칸에 들어선 뒤 이어지는 동작까지의 사이 */
const BEAT = 1400;
/** 잇는 선이 글자에서 떨어져 있는 거리(디자인 px) */
const GAP = 16;
/** 장 전체가 떠오르고 자리를 잡기까지 걸리는 시간 */
const ENTER = 1500;

/** 새 화면이 하는 일 셋 */
const POINTS = [
  {
    index: "01",
    title: "Two Starting Points",
    body: "접속한 국가 안에서 볼지, 전 세계를 볼지 한 번의 전환으로 오갑니다.",
    place: "col-start-1 col-span-2 row-start-4 row-span-2",
  },
  {
    index: "02",
    title: "Spin and Find",
    body: "지구본을 돌려 도시를 찾고, 점을 눌러 그 도시에 어떤 매장이 있는지 확인합니다.",
    place: "col-start-7 col-span-2 row-start-2 row-span-2",
  },
  {
    index: "03",
    title: "Same Familiar List",
    body: "발견한 뒤에는 지금 쓰던 것과 같은 매장 정보로 이어져, 익숙한 흐름을 그대로 씁니다.",
    place: "col-start-7 col-span-2 row-start-5 row-span-2 issue-low",
  },
];

/** 제안을 한 화면으로 보여 주는 장 */
export function SceneAfter() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [stage, setStage] = useState({ picked: POINTS[0].index, phase: 0 });
  const { picked, phase } = stage;

  /* 장이 보이는 동안 01 부터 03 까지 한 번 훑고 멈춥니다. */
  useEffect(() => {
    if (!inView) {
      const id = setTimeout(() => setStage({ picked: POINTS[0].index, phase: 0 }), 0);
      return () => clearTimeout(id);
    }
    const now = POINTS.findIndex((point) => point.index === picked);
    if (now === POINTS.length - 1) return;

    const id = setTimeout(
      () => setStage({ picked: POINTS[now + 1].index, phase: 0 }),
      DWELL,
    );
    return () => clearTimeout(id);
  }, [inView, picked]);

  /* 칸에 들어서고 잠시 뒤 화면이 한 걸음 더 나갑니다. */
  useEffect(() => {
    if (phase >= 1) return;
    const id = setTimeout(() => setStage((now) => ({ ...now, phase: 1 })), BEAT);
    return () => clearTimeout(id);
  }, [picked, phase]);

  /* 고른 항목과 그 점을 잇는 선 */
  const cards = useRef<Record<string, HTMLButtonElement | null>>({});
  const dots = useRef<Record<string, HTMLButtonElement | null>>({});
  const [link, setLink] = useState<{ d: string; len: number } | null>(null);

  const dotRef = useCallback((key: string, el: HTMLButtonElement | null) => {
    dots.current[key] = el;
  }, []);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(inView), inView ? ENTER : 0);
    return () => clearTimeout(id);
  }, [inView]);

  useEffect(() => {
    const card = cards.current[picked];
    const dot = dots.current[picked];
    const grid = card?.closest(".page-grid");
    if (!ready || !card || !dot || !grid) return;

    function measure() {
      const g = grid!.getBoundingClientRect();
      const c = card!.getBoundingClientRect();
      const d = dot!.getBoundingClientRect();
      const toX = d.left + d.width / 2 - g.left;
      const toY = d.top + d.height / 2 - g.top;

      const range = document.createRange();
      range.selectNodeContents(card!);
      const lines = [...range.getClientRects()].filter((line) => line.width > 0);
      const last = card!.lastElementChild!.getBoundingClientRect();
      const gap = GAP * (g.width / 1440);
      const toRight = c.left - g.left < toX;
      const edge = toRight
        ? Math.max(...lines.map((line) => line.right)) + gap
        : Math.min(...lines.map((line) => line.left)) - gap;
      const fromX = edge - g.left;
      const fromY = (c.top + last.bottom) / 2 - g.top;
      const midX = (fromX + toX) / 2;
      setLink({
        d: `M ${toX} ${toY} L ${midX} ${toY} L ${midX} ${fromY} L ${fromX} ${fromY}`,
        len:
          Math.abs(midX - fromX) + Math.abs(toY - fromY) + Math.abs(toX - midX),
      });
    }

    const frame = requestAnimationFrame(measure);
    const settled = setTimeout(measure, 520);
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settled);
      observer.disconnect();
    };
  }, [picked, phase, ready]);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        From Store List
        <br />
        To Spatial Discovery
      </h2>

      {/* 화면 하나. 앞 장 목업과 같은 두 단에 섭니다. */}
      <div
        className="after-frame rise col-start-4 col-span-2 row-start-1 row-span-6"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        <StoreGlobeMock
          dots
          step={picked}
          phase={phase}
          dotRef={dotRef}
          onPick={(key) => setStage({ picked: key, phase: 0 })}
        />
      </div>

      {ready && link && (
        <svg className="link" key={picked} aria-hidden>
          <defs>
            <mask id={`after-${picked}`} maskUnits="userSpaceOnUse">
              <path
                className="link-reveal"
                d={link.d}
                style={{ "--len": link.len } as CSSProperties}
              />
            </mask>
          </defs>
          <path
            className="link-dash"
            d={link.d}
            mask={`url(#after-${picked})`}
          />
        </svg>
      )}

      {POINTS.map((point, i) => (
        <button
          type="button"
          key={point.index}
          ref={(el) => {
            cards.current[point.index] = el;
          }}
          className={`issue rise ${point.place}`}
          data-dim={picked !== point.index ? true : undefined}
          onClick={() => setStage({ picked: point.index, phase: 0 })}
          style={{ "--delay": `${0.18 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </button>
      ))}
    </div>
  );
}
