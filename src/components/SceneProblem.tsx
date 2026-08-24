"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { useInView } from "@/components/useInView";
import { StoreListMock } from "@/components/StoreListMock";

/** 한 칸이 머무는 시간 */
const DWELL = 5500;
/** 칸에 들어선 뒤 이어지는 동작까지의 사이 */
const BEAT = 1400;
/** 눌리는 시늉을 보여 주고 결과가 나오기까지의 짧은 사이 */
const PRESS = 700;
/** 잇는 선이 글자에서 떨어져 있는 거리(디자인 px) */
const GAP = 16;
/** 장 전체가 떠오르고 자리를 잡기까지 걸리는 시간 */
const ENTER = 1500;

/** 지금 화면이 하는 일과, 그 위에 더할 것 */
const POINTS = [
  {
    index: "01",
    title: "Functional Search",
    body: "현재 위치와 선택한 지역을 기준으로 가까운 매장을 빠르게 찾을 수 있습니다.",
    place: "col-start-1 col-span-2 row-start-4 row-span-2",
  },
  {
    index: "02",
    title: "Local Context",
    body: "탐색은 접속 국가와 현재 위치를 중심으로 시작되어, 가까운 지역의 매장 정보에 집중됩니다.",
    place: "col-start-7 col-span-2 row-start-3 row-span-2",
  },
  {
    index: "03",
    title: "Limited Global View",
    body: "각 매장은 개별 정보로 확인되지만, 전 세계 여러 도시와 연결된 브랜드의 확장감은 한눈에 드러나지 않습니다.",
    place: "col-start-7 col-span-2 row-start-5 row-span-2 issue-low",
  },
];

/** 지금 화면을 짚고 방향을 제안하는 장 */
export function SceneProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  /** 목업 위의 점과 아래 항목은 번호로 짝지어져 있습니다.
      phase 0 은 칸에 막 들어선 참, 1 은 이어지는 동작이 벌어진 뒤입니다. */
  const [stage, setStage] = useState({ picked: POINTS[0].index, phase: 0 });
  const { picked, phase } = stage;
  const step = POINTS.findIndex((point) => point.index === picked);

  /* 장이 보이는 동안 01 부터 03 까지 한 번 훑고 멈춥니다.
     장을 벗어나면 01 로 되감고, 점을 누르면 그 칸부터 다시 셉니다. */
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

  /* 고른 항목과 그 점을 잇는 점선. 칸이 바뀌거나 창이 바뀌면 다시 잽니다. */
  const cards = useRef<Record<string, HTMLDivElement | null>>({});
  const dots = useRef<Record<string, HTMLButtonElement | null>>({});
  const [link, setLink] = useState<{ d: string; len: number } | null>(null);

  const dotRef = useCallback((key: string, el: HTMLButtonElement | null) => {
    dots.current[key] = el;
  }, []);

  /* 요소가 떠오르는 동안 재면 선이 어긋납니다. 다 자리 잡은 뒤부터 긋습니다. */
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
      /* 항목의 목업 쪽 글 끝에서 나와 두 번 꺾어 점으로 들어갑니다.
         자리가 늘 내용보다 커서, 상자가 아니라 글이 실제로 차지한 만큼을 잽니다. */
      const range = document.createRange();
      range.selectNodeContents(card!);
      const lines = [...range.getClientRects()].filter((line) => line.width > 0);
      const last = card!.lastElementChild!.getBoundingClientRect();
      // 캔버스는 1440 을 기준으로 줄어들므로 간격도 같은 비율로 잽니다.
      const gap = GAP * (g.width / 1440);
      const toRight = c.left - g.left < toX;
      const edge = toRight
        ? Math.max(...lines.map((line) => line.right)) + gap
        : Math.min(...lines.map((line) => line.left)) - gap;
      const fromX = edge - g.left;
      const fromY = (c.top + last.bottom) / 2 - g.top;
      // 꺾이는 자리는 항목과 점 사이 한가운데 — 늘 목업 바깥 여백에 놓입니다.
      const midX = (fromX + toX) / 2;
      setLink({
        // 점에서 출발해 항목 쪽으로 그어지도록 점을 시작점으로 둡니다.
        d: `M ${toX} ${toY} L ${midX} ${toY} L ${midX} ${fromY} L ${fromX} ${fromY}`,
        len:
          Math.abs(midX - fromX) + Math.abs(toY - fromY) + Math.abs(toX - midX),
      });
    }

    const frame = requestAnimationFrame(measure);
    // 눌린 자리가 커지는 동안에도 점이 움직이므로 멎은 뒤 한 번 더 잽니다.
    const settled = setTimeout(measure, 520);
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settled);
      observer.disconnect();
    };
  }, [picked, phase, ready]);

  /* 칸에 들어서고 잠시 뒤 동작이 이어집니다.
     2번 칸만 두 박자를 씁니다 — 서울을 누르는 참, 그리고 그 결과. */
  useEffect(() => {
    if (phase >= 2) return;
    const id = setTimeout(
      () => setStage((now) => ({ ...now, phase: now.phase + 1 })),
      phase === 0 ? BEAT : PRESS,
    );
    return () => clearTimeout(id);
  }, [picked, phase]);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-4 row-start-1 row-span-2">
        Beyond Finding
        <br />
        Toward Global Awareness
      </h2>

      {/* 지금 화면. 자리는 네 단이지만 목업은 그 가운데 두 단만 씁니다.
          남는 좌우는 크게 뜨는 이름표가 걸칠 자리입니다. */}
      <div
        className="store-slot rise col-start-3 col-span-4 row-start-2 row-span-5"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <StoreListMock
          dots
          picked={picked}
          phase={phase}
          dotRef={dotRef}
          onPick={(key) => setStage({ picked: key, phase: 0 })}
        />

        <div className="store-scrim" />
        <div className="store-steps" style={{ "--dwell": `${DWELL}ms` } as CSSProperties}>
          {POINTS.map((point, i) => (
            <span
              key={point.index}
              className="step"
              data-state={i < step ? "done" : i === step ? "now" : undefined}
            >
              <span className="step-fill" />
            </span>
          ))}
        </div>
      </div>

      {ready && link && (
        <svg className="link" key={picked} aria-hidden>
          {/* 점선은 그 자리에 있고, 점에서부터 자라는 마스크가 그것을 열어 줍니다. */}
          <defs>
            <mask id={`link-${picked}`} maskUnits="userSpaceOnUse">
              <path
                className="link-reveal"
                d={link.d}
                style={{ "--len": link.len } as CSSProperties}
              />
            </mask>
          </defs>
          <path className="link-dash" d={link.d} mask={`url(#link-${picked})`} />
        </svg>
      )}

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          ref={(el) => {
            cards.current[point.index] = el;
          }}
          className={`issue rise ${point.place}`}
          data-dim={picked && picked !== point.index ? true : undefined}
          style={{ "--delay": `${0.18 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
