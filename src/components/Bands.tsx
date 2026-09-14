"use client";

/**
 * 세 번째 판의 위아래 띠
 *
 * 판의 위아래 여백(60) 안에 앉는 잔글씨입니다 —
 *   위: 하는 일 · 지금 갈래 #몇 장째 ── 포트폴리오 · 해
 *   아래: © 이름 ── 쪽번호
 * 판(.page-grid)과 같은 여덟 단 위에 놓여 글이 단 머리에 맞춰 섭니다.
 * 표지(인트로) · 세 갈래(work) · 맺음 장에는 두지 않습니다 — v3.css 가 감춥니다.
 *
 * 위 띠의 왼쪽(갈래 · 장)은 누르면 목차가 펼쳐집니다 — 스물셋 장을 갈래별로
 * 묶어 적고, 고르면 그 장으로 옮겨 갑니다.
 */

import { useEffect, useRef, useState } from "react";

import { SLUGS } from "@/app/slugs";

/** 갈래 셋 — 주소 첫 자리와 머리에 적을 이름 */
const BRANDS = [
  { at: "gentle-monster", name: "Gentle Monster" },
  { at: "tamburins", name: "Tamburins" },
  { at: "nudake", name: "Nudake" },
];

/** 목차 — 덱에 선 차례 그대로. 번호는 갈래 안에서 셉니다(01 부터). */
/** zero 인 갈래는 표지(첫 장)를 00 으로 세고, 그 뒤가 01 부터입니다. */
const TOC: {
  head: string;
  zero?: boolean;
  pages: { id: string; name: string }[];
}[] = [
  {
    head: "Intro",
    zero: true,
    pages: [
      { id: "switch", name: "Opening" },
      { id: "statement", name: "Concept Statement" },
      { id: "principles", name: "UX Principles" },
      { id: "closing", name: "Transition" },
      { id: "work", name: "Project Index" },
    ],
  },
  {
    head: "Gentle Monster Explore",
    zero: true,
    pages: [
      { id: "gentle-monster-paper", name: "Project Overview" },
      { id: "gentle-monster-problem", name: "Current Experience" },
      { id: "gentle-monster-why", name: "Opportunity" },
      { id: "gentle-monster-explore", name: "Interaction Proposal" },
      { id: "gentle-monster-after", name: "Final Experience" },
    ],
  },
  {
    head: "Tamburins Compose",
    zero: true,
    pages: [
      { id: "tamburins", name: "Project Overview" },
      { id: "tamburins-screens", name: "Current Flow" },
      { id: "tamburins-flow", name: "Pain Point" },
      { id: "tamburins-shift", name: "Design Direction" },
      { id: "tamburins-one", name: "Final Proposal" },
    ],
  },
  {
    head: "Nudake Gifting",
    zero: true,
    pages: [
      { id: "nudake", name: "Project Overview" },
      { id: "nudake-context-2", name: "Brand Context" },
      { id: "nudake-signs-2", name: "Discovery Problem" },
      { id: "nudake-gap-3", name: "Experience Gap" },
      { id: "nudake-gap-4", name: "Design Proposal" },
      { id: "nudake-flow-full", name: "Final Experience" },
    ],
  },
  {
    head: "Outro",
    pages: [
      { id: "close", name: "Closing Summary" },
      { id: "thanks", name: "End Note" },
    ],
  },
];

const no = (n: number) => String(n).padStart(2, "0");

const MAIL = "sunnee.dsgnr@gmail.com";

export function Bands({
  id,
  index,
  total,
}: {
  id: string;
  index: number;
  total: number;
}) {
  /* 이 장이 어느 갈래의 몇 장째인지 — 주소(`nudake/03`)로 압니다. */
  const [here, page = ""] = (SLUGS[id] ?? "").split("/");
  const brand = BRANDS.find((one) => one.at === here);

  /* 목차. 장마다 제 띠가 있어 열림도 장마다 따로입니다 — 옮겨 가면 접습니다. */
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  /* 갈래는 하나만 펼쳐집니다 — 처음엔 지금 장이 든 갈래. 다른 갈래 이름을
     누르면 그쪽이 펼쳐지고, 펼쳐진 것을 다시 누르면 접힙니다. */
  const mine = TOC.findIndex((group) => group.pages.some((one) => one.id === id));
  const [shown, setShown] = useState(mine);

  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    const esc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  /* 메일 주소는 누르면 복사됩니다. 잠시 `Copied` 로 바뀌었다가 돌아옵니다. */
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(MAIL).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  /** 고른 장으로 — 여러 장을 건너뛰는 자리라 굴리지 않고 바로 섭니다.
      사이 장들을 죽 지나며 주소가 차례로 바뀌는 것보다, 그 장에 곧장 서고
      주소도 그 자리에서 바로 바뀌는 편이 맞습니다. */
  const go = (to: string) => {
    setOpen(false);
    document.getElementById(to)?.scrollIntoView({ behavior: "auto" });
  };

  return (
    <>
      <div className="band band-top">
        {/* 하는 일 ── 지금 갈래와 그 갈래 안의 몇 장째(주소의 번호). 누르면 목차. */}
        <div
          ref={box}
          className="band-cell band-toc col-start-1 col-span-3"
          data-open={open || undefined}
        >
          <button
            type="button"
            className="band-toc-head"
            aria-label={open ? "목차 닫기" : "목차 열기"}
            aria-expanded={open}
            onClick={() => setOpen((now) => !now)}
          >
            <span>UX</span>
            <i className="band-rule" />
            <span>
              {brand?.name}{" "}
              {/^\d+$/.test(page)
                ? `#${no(Number(page))}`
                : page.charAt(0).toUpperCase() + page.slice(1)}
            </span>
            {/* 아래를 가리키는 세모. 펼쳐지면 뒤집힙니다. */}
            <svg className="band-toc-cue" viewBox="0 0 10 10" aria-hidden>
              <path d="M2 3.5 H8 L5 7 Z" fill="currentColor" />
            </svg>
          </button>

          {/* 펼친 동안 판 위에 깔리는 딤드. 누르면 접힙니다. */}
          <span
            className="band-toc-veil"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <nav className="band-toc-list" aria-label="목차">
            {TOC.map((group, g) => (
              <div
                className="band-toc-group"
                key={group.head}
                data-shown={shown === g || undefined}
              >
                <button
                  type="button"
                  className="band-toc-title"
                  aria-expanded={shown === g}
                  onClick={() => setShown((now) => (now === g ? -1 : g))}
                  tabIndex={open ? 0 : -1}
                >
                  <span>{group.head}</span>
                  <svg className="band-toc-cue" viewBox="0 0 10 10" aria-hidden>
                    <path d="M2 3.5 H8 L5 7 Z" fill="currentColor" />
                  </svg>
                </button>
                {shown === g &&
                  group.pages.map((one, k) => {
                  /* 번호는 그 갈래 안에서 셉니다 — 표지가 있는 갈래는 00 부터. */
                  const n = group.zero ? k : k + 1;
                  return (
                    <button
                      type="button"
                      key={one.id}
                      className="band-toc-item"
                      data-now={one.id === id || undefined}
                      aria-current={one.id === id ? "page" : undefined}
                      onClick={() => go(one.id)}
                      tabIndex={open ? 0 : -1}
                    >
                      <span className="band-toc-no">{no(n)}</span>
                      <span>{one.name}</span>
                    </button>
                  );
                  })}
              </div>
            ))}

            {/* 맨 아래 — 연락처. 남는 자리를 두고 바닥에 붙습니다.
                누르면 주소가 복사되고 잠시 `Copied` 로 답합니다. */}
            <button
              type="button"
              className="band-toc-contact"
              data-copied={copied || undefined}
              onClick={copy}
              tabIndex={open ? 0 : -1}
            >
              <span>Contact</span>
              <span className="band-toc-mail">
                {copied ? "Copied" : MAIL}
                {/* 바깥으로 이어진다는 표시 — 오른쪽 위로 향하는 빗금. */}
                <svg viewBox="0 0 10 10" aria-hidden>
                  <path
                    d="M2.5 7.5 L7.5 2.5 M3.5 2.5 H7.5 V6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </nav>
        </div>

        <p className="band-cell band-right col-start-8" aria-hidden>
          <span>Portfolio</span>
          <span>2026</span>
        </p>
      </div>

      <div className="band band-bottom" aria-hidden>
        <p className="band-cell col-start-1 col-span-3">
          <span>© Park Kyungsun</span>
        </p>
        <p className="band-cell band-right col-start-7 col-span-2">
          <span>
            {no(index + 1)} / {no(total)}
          </span>
        </p>
      </div>
    </>
  );
}
