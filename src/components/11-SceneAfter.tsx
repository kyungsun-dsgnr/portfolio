"use client";

/** 10장 — 제안 화면 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import QRCode from "qrcode";

import { StoreGlobeMock } from "@/components/StoreGlobeMock";
import { glide } from "@/components/glide";
import { useInView } from "@/components/useInView";

/** 잇는 선이 글자에서 떨어져 있는 거리(디자인 px) */
const GAP = 16;
/** 장 전체가 떠오르고 자리를 잡기까지 걸리는 시간 */
const ENTER = 1500;

/** 휴대폰에서 열리는 자리. 저장소 하위에 배포되는 경우까지 함께 셈합니다. */
const PHONE_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/m/globe/`;

/** 새 화면이 하는 일 둘 */
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

  /* 점을 누르면 그 자리가 켜집니다. 03 을 누르면 아래 매장 목록으로 굴러갑니다. */
  const [picked, setPicked] = useState<string | null>(null);

  const pick = useCallback((key: string) => {
    setPicked((now) => (now === key ? null : key));
  }, []);

  useEffect(() => {
    if (!picked) return;
    const screen = dots.current[picked]?.closest<HTMLElement>(".globe-mock");
    if (!screen) return;
    /* 02 · 03 은 매장 목록을 보여 주는 자리라 목록이 보이도록 굴려 둡니다. */
    const to =
      picked === "01"
        ? 0
        : (screen.querySelector<HTMLElement>(".globe-list")?.offsetTop ?? 0);
    const stop = glide(screen, to, 1200);
    return stop;
  }, [picked]);

  /* 판 위 목업은 결국 그림입니다. QR 하나를 두어, 보는 사람이
     제 손의 기기에서 같은 화면을 직접 굴려 보게 합니다. */
  const [mark, setMark] = useState<string | null>(null);

  useEffect(() => {
    const to = `${window.location.origin}${PHONE_PATH}`;
    QRCode.toString(to, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: "#fafafa", light: "#00000000" },
    })
      .then(setMark)
      .catch(() => setMark(null));
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
        /* 선은 제목 줄에서 떠납니다. 글 전체를 기준으로 하면 본문 줄 수에 따라
           항목마다 다른 높이에서 나갑니다. */
        const head = card.querySelector<HTMLElement>(".type-title");
        if (!head) continue;
        const h = head.getBoundingClientRect();

        const range = document.createRange();
        range.selectNodeContents(head);
        const lines = [...range.getClientRects()].filter(
          (line) => line.width > 0,
        );
        if (!lines.length) continue;
        const gap = GAP * (g.width / 1440);
        const toRight = c.left - g.left < toX;
        const edge = toRight
          ? Math.max(...lines.map((line) => line.right)) + gap
          : Math.min(...lines.map((line) => line.left)) - gap;
        const fromX = edge - g.left;
        const fromY = h.top + h.height / 2 - g.top;
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
        Local Search,
        <br />
        Global Discovery
      </h2>

      {/* 화면 하나. 08장 목업과 같은 자리·같은 높이에 섭니다. */}
      <div
        className="after-frame rise col-start-4 col-span-2 row-start-2 row-span-5"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        {/* 점을 누르면 그 자리가 켜지고, 매장 목록이 그에 맞춰 바뀝니다. */}
        <StoreGlobeMock
          dots
          skipDots={["03"]}
          step={picked === "03" ? null : picked}
          phase={picked === "01" ? 0 : 1}
          onPick={pick}
          dotRef={dotRef}
        />
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

      {/* 손에 쥔 기기에서 열어 보는 자리 — 옛 02 항목이 서 있던 칸입니다. */}
      <div
        className="qr-card rise col-start-7 col-span-2 row-start-2 row-span-2"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
        <p className="qr-eyebrow">Try it on your phone</p>

        {mark && (
          <div
            className="qr-mark"
            aria-hidden
            dangerouslySetInnerHTML={{ __html: mark }}
          />
        )}
      </div>

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
