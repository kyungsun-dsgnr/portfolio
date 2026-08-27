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

/** 잇는 선이 글자에서 떨어져 있는 거리(디자인 px) */
const GAP = 16;
/** 장 전체가 떠오르고 자리를 잡기까지 걸리는 시간 */
const ENTER = 1500;

/** 새 화면이 하는 일 셋 */
const POINTS = [
  {
    index: "01",
    title: "One Flow, Two Starts",
    body: "가까운 매장을 찾는 현재 국가 뷰와 세계를 둘러보는 글로벌 뷰를 한 번의 전환으로 오갑니다.",
    place: "col-start-1 col-span-2 row-start-4 row-span-2",
  },
  {
    index: "02",
    title: "Turn, Select, Discover",
    body: "지구본을 돌리고 도시를 선택해 해당 지역의 스토어를 발견합니다.",
    place: "col-start-7 col-span-2 row-start-2 row-span-2",
  },
  {
    index: "03",
    title: "Continue to Details",
    body: "도시를 선택한 뒤에는 기존 매장 목록과 상세 정보로 자연스럽게 이어집니다.",
    place: "col-start-7 col-span-2 row-start-5 row-span-2 issue-low",
  },
];

/** 제안을 한 화면으로 보여 주는 장 */
export function SceneAfter() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* 셋을 차례로 훑지 않고 한꺼번에 켜 둡니다. 세 항목 모두 제 점과 이어집니다. */
  const cards = useRef<Record<string, HTMLButtonElement | null>>({});
  const dots = useRef<Record<string, HTMLButtonElement | null>>({});
  const [links, setLinks] = useState<
    Record<string, { d: string; len: number }>
  >({});

  const dotRef = useCallback((key: string, el: HTMLButtonElement | null) => {
    dots.current[key] = el;
  }, []);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(inView), inView ? ENTER : 0);
    return () => clearTimeout(id);
  }, [inView]);

  useEffect(() => {
    const grid = cards.current[POINTS[0].index]?.closest(".page-grid");
    if (!ready || !grid) return;
    /* 점 셋은 목업 안에 있어 목업을 굴리면 함께 움직입니다. */
    const screen = grid.querySelector<HTMLElement>(".globe-mock");

    function measure() {
      const g = grid!.getBoundingClientRect();
      const view = screen?.getBoundingClientRect();
      const drawn: Record<string, { d: string; len: number }> = {};

      for (const point of POINTS) {
        const card = cards.current[point.index];
        const dot = dots.current[point.index];
        if (!card || !dot) continue;

        const c = card.getBoundingClientRect();
        const d = dot.getBoundingClientRect();
        /* 점이 화면 밖으로 굴러 나가면 선도 함께 걷습니다.
           남겨 두면 아무것도 없는 자리를 가리킵니다. */
        const mid = d.top + d.height / 2;
        if (view && (mid < view.top || mid > view.bottom)) continue;
        const toX = d.left + d.width / 2 - g.left;
        const toY = d.top + d.height / 2 - g.top;

        /* 글줄의 실제 끝에서 떠납니다. 항목 상자가 아니라 글자를 기준으로 해야
           줄이 짧은 항목에서도 선이 글자에 바로 붙습니다. */
        const range = document.createRange();
        range.selectNodeContents(card);
        const lines = [...range.getClientRects()].filter(
          (line) => line.width > 0,
        );
        if (!lines.length) continue;
        const last = card.lastElementChild!.getBoundingClientRect();
        const gap = GAP * (g.width / 1440);
        const toRight = c.left - g.left < toX;
        const edge = toRight
          ? Math.max(...lines.map((line) => line.right)) + gap
          : Math.min(...lines.map((line) => line.left)) - gap;
        const fromX = edge - g.left;
        const fromY = (c.top + last.bottom) / 2 - g.top;
        const midX = (fromX + toX) / 2;

        drawn[point.index] = {
          d: `M ${toX} ${toY} L ${midX} ${toY} L ${midX} ${fromY} L ${fromX} ${fromY}`,
          len:
            Math.abs(midX - fromX) +
            Math.abs(toY - fromY) +
            Math.abs(toX - midX),
        };
      }

      setLinks(drawn);
    }

    const frame = requestAnimationFrame(measure);
    const settled = setTimeout(measure, 520);
    const observer = new ResizeObserver(measure);
    observer.observe(grid);

    /* 굴릴 때마다 다시 잽니다. 한 프레임에 한 번으로 묶어 둡니다. */
    let queued = 0;
    function onScroll() {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        measure();
      });
    }
    screen?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(queued);
      clearTimeout(settled);
      observer.disconnect();
      screen?.removeEventListener("scroll", onScroll);
    };
  }, [ready]);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        Local search,
        <br />
        global discovery
      </h2>

      {/* 화면 하나. 앞 장 목업과 같은 두 단에 섭니다. */}
      <div
        className="after-frame rise col-start-4 col-span-2 row-start-2 row-span-5"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        {/* 점은 자리를 가리키기만 합니다. 순회하지 않으니 셋 다 켜 둡니다. */}
        <StoreGlobeMock dots step={null} phase={1} dotRef={dotRef} />
      </div>

      {ready &&
        POINTS.map((point) => {
          const link = links[point.index];
          if (!link) return null;
          return (
            <svg className="link" key={point.index} aria-hidden>
              <defs>
                <mask id={`after-${point.index}`} maskUnits="userSpaceOnUse">
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
                mask={`url(#after-${point.index})`}
              />
            </svg>
          );
        })}

      {POINTS.map((point, i) => (
        <button
          type="button"
          key={point.index}
          ref={(el) => {
            cards.current[point.index] = el;
          }}
          className={`issue rise ${point.place}`}
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
