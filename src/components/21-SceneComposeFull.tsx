"use client";

/**
 * 탬버린즈 05 — One screen, one gift.
 *
 * 장은 따로 서 있지만, 보는 눈에는 장이 넘어간 것으로 읽히면 안 됩니다.
 * 앞장 화면이 서 있던 그 자리에 이 화면을 붙들어 두고,
 * 판이 올라오는 만큼 높이만 자라게 합니다 — 화면이 길어지며 속이 바뀌는 셈입니다.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import QRCode from "qrcode";

import { TamburinsComposeScreenB } from "@/components/TamburinsComposeScreenB";
import { useInView } from "@/components/useInView";

/** 앞장에서 짚은 네 가지 불편과, 이 화면이 그것을 어떻게 닫는지.
    번호는 `Current User Flow` 의 걸리는 지점 번호와 그대로 짝지어집니다. */
const FIXED = [
  {
    index: "01",
    title: "Seen Before Bought",
    body: "고를 때마다 상자 안 제품이 그 향의 제품으로 바뀌고, 담기 전에 구성과 값을 함께 확인합니다.",
    place: "col-start-1 col-span-2 row-start-5 row-span-2",
  },
  {
    index: "02",
    title: "Set, Revealed in Place",
    body: "세트를 고르면 그 자리에서 구성이 드러납니다. 상세로 들어가거나 선택 창을 여는 일 없이, 향까지 같은 화면의 층에서 이어집니다.",
    place: "col-start-7 col-span-2 row-start-2 row-span-2",
  },
  {
    index: "03",
    title: "Notes Where You Choose",
    body: "향노트가 고르는 줄에 적혀 있고, 펼치면 설명과 Top·Middle·Base 가 그 줄에서 열립니다. 창을 넘길 일이 없습니다.",
    place: "col-start-7 col-span-2 row-start-5 row-span-2",
  },
];

/** 잇는 선이 글자에서 떨어져 있는 거리(디자인 px) */
const GAP = 16;

/** 휴대폰에서 열리는 자리. 저장소 하위에 배포되는 경우까지 함께 셈합니다. */
const PHONE_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/m/compose/`;

export function SceneComposeFull() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  /* 앞장 화면 높이에서 이 장 높이까지 자란 정도(px) */
  const [tall, setTall] = useState<number | null>(null);
  /* 화면을 제자리에 붙들어 두기 위해 되돌릴 거리(px) */
  const [lift, setLift] = useState(0);

  /* 손에 쥔 기기에서 이 화면을 직접 굴려 보는 자리 */
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

  const [play, setPlay] = useState(0);
  /* 상자가 다 떠오른 뒤라야 선을 긋습니다. */
  const [tied, setTied] = useState(false);

  useEffect(() => {
    if (!inView) {
      const off = window.setTimeout(() => setTied(false), 0);
      return () => clearTimeout(off);
    }
    const again = window.setTimeout(() => setPlay((n) => n + 1), 0);
    /* 뚜껑이 열리기까지 900ms, 상자가 다 밝아지기까지 1700ms. */
    const tie = window.setTimeout(() => setTied(true), 2400);
    return () => {
      clearTimeout(again);
      clearTimeout(tie);
    };
  }, [inView]);

  /* 항목과 화면 위 번호 점을 잇는 점선 */
  const cards = useRef<Record<string, HTMLDivElement | null>>({});
  const dots = useRef<Record<string, HTMLSpanElement | null>>({});
  const [links, setLinks] = useState<
    Record<string, { d: string; len: number }>
  >({});
  /* 마지막으로 그린 값. 같은 값이면 다시 그리지 않습니다. */
  const shown = useRef("");
  const lifted = useRef(0);
  /* 되돌림 없이 잰 제자리 값. 한 번만 재면 되는 상수입니다. */
  const own = useRef<number | null>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const here = frame.current?.closest<HTMLElement>(".section");
    const root = here?.closest<HTMLElement>(".scroll-root");
    const box = frame.current;
    if (!here || !root || !box) return;

    /* 앞장에서 이 화면이 서 있던 자리. 장 안에서의 거리라 스크롤과 무관합니다. */
    const before = here.previousElementSibling;
    const seed = before?.querySelector<HTMLElement>(".merge-new");

    let queued = 0;
    function measure() {
      queued = 0;
      const mine = here!.getBoundingClientRect();
      const span = mine.height || 1;
      /* 아래로 한 판만큼 떨어져 있으면 0, 제자리에 서면 1 입니다. */
      const p = Math.min(1, Math.max(0, 1 - mine.top / span));

      if (own.current === null) {
        box!.style.setProperty("--lift", "0px");
        own.current = box!.getBoundingClientRect().top - mine.top;
      }
      const grid = box!.offsetParent as HTMLElement | null;

      if (!seed || !before) {
        setTall(null);
        setLift(0);
        return;
      }
      const from = seed.getBoundingClientRect();
      const start = from.top - before.getBoundingClientRect().top;

      const next = (1 - p) * (start - own.current! - span);
      lifted.current = next;
      setLift(next);
      /* 키는 앞장 화면 높이에서 판 안쪽 높이까지 함께 자랍니다.
         판의 위아래 여백을 빼지 않으면 아래로 넘칩니다. */
      const pad = grid ? getComputedStyle(grid) : null;
      const full =
        (grid?.clientHeight ?? 0) -
        parseFloat(pad?.paddingTop ?? "0") -
        parseFloat(pad?.paddingBottom ?? "0");
      /* 앞장 목업을 아직 재지 못했거나 제자리에 다 섰으면 판 높이를 그대로 씁니다.
         0 을 기준으로 재면 화면이 머리와 바닥만 남고 쪼그라듭니다. */
      setTall(
        from.height > 0 && p < 1
          ? from.height + (full - from.height) * p
          : full,
      );
    }

    /* 화면이 자라고 붙들려 움직이는 동안 점도 함께 움직입니다.
       선은 그때마다 다시 잽니다. */
    function draw() {
      const grid = frame.current?.closest(".page-grid");
      if (!grid) return;
      const g = grid.getBoundingClientRect();
      const drawn: Record<string, { d: string; len: number }> = {};

      for (const key of Object.keys(cards.current)) {
        const card = cards.current[key];
        const dot = dots.current[key];
        if (!card || !dot) continue;

        const c = card.getBoundingClientRect();
        const d = dot.getBoundingClientRect();
        if (!d.width) continue;

        const toX = d.left + d.width / 2 - g.left;
        const toY = d.top + d.height / 2 - g.top;

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

        drawn[key] = {
          d: `M ${toX} ${toY} L ${midX} ${toY} L ${midX} ${fromY} L ${fromX} ${fromY}`,
          len:
            Math.abs(midX - fromX) +
            Math.abs(toY - fromY) +
            Math.abs(toX - midX),
        };
      }

      const key = JSON.stringify(drawn);
      if (key === shown.current) return;
      shown.current = key;
      setLinks(drawn);
    }

    let until = 0;
    let looping = false;

    function loop() {
      measure();
      draw();
      if (performance.now() < until) {
        queued = requestAnimationFrame(loop);
      } else {
        looping = false;
      }
    }

    function onScroll() {
      /* 화면이 자라는 동안에도, 항목이 떠오르며 자리를 잡는 동안에도 따라갑니다.
         먼저 멈추면 선이 아직 내려와 있던 글의 자리에 그어집니다. */
      until = performance.now() + 2600;
      if (looping) return;
      looping = true;
      queued = requestAnimationFrame(loop);
    }

    onScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(queued);
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="page-grid compose-full"
      data-visible={inView || undefined}
    >
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        One screen,
        <br />
        one gift.
      </h2>

      {/* 판 위 목업은 결국 그림입니다. QR 로 제 손의 기기에서 굴려 보게 합니다. */}
      <div
        className="qr-card rise col-start-1 col-span-2 row-start-2"
        style={{ "--delay": "0.24s" } as CSSProperties}
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

      {inView &&
        tied &&
        Object.entries(links).map(([key, link]) => (
          <svg className="link" key={`${key}-${play}`} aria-hidden>
            <defs>
              <mask id={`fixed-${key}-${play}`} maskUnits="userSpaceOnUse">
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
              mask={`url(#fixed-${key}-${play})`}
            />
          </svg>
        ))}

      {/* 닫힌 불편 넷. 목업 좌우로 갈라 세웁니다. */}
      {FIXED.map((one, i) => (
        <div
          key={one.index}
          ref={(el) => {
            cards.current[one.index] = el;
          }}
          className={`issue rise ${one.place}`}
          style={{ "--delay": `${0.3 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{one.index}</span>
          <h3 className="type-title">{one.title}</h3>
          <p className="type-body">{one.body}</p>
        </div>
      ))}

      {/* 앞장에서 보던 그 화면. 자리는 그대로 두고 키만 자랍니다. */}
      <div
        ref={frame}
        className="compose-full-frame"
        style={
          {
            "--tall": tall === null ? undefined : `${tall}px`,
            "--lift": `${lift}px`,
          } as CSSProperties
        }
      >
        <TamburinsComposeScreenB
          dots
          dotRef={(key, el) => {
            dots.current[key] = el;
          }}
        />
      </div>
    </div>
  );
}
