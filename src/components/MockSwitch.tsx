"use client";

/**
 * 손에 쥔 화면 사이를 오가는 단추
 *
 * 머리의 로고 오른쪽에 작은 ▽ 가 서고, 누르면 머리 아래로 세 갈래의 이름이
 * 펼쳐집니다. 다른 이름을 누르면 그 화면으로 갑니다. 지금 보는 것은
 * 오른쪽에 점으로 표시합니다.
 *
 * 자리는 셈하지 않고 화면에 선 로고와 머리를 재서 잡습니다 — 머리마다
 * 단위(--u · --s)와 도면 폭이 달라, 비율로 어림하면 한두 픽셀씩 어긋납니다.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Id = "gentle-monster" | "tamburins" | "nudake";

const MOCKS: { id: Id; name: string }[] = [
  { id: "gentle-monster", name: "Gentle Monster" },
  { id: "tamburins", name: "Tamburins" },
  { id: "nudake", name: "Nudake" },
];

/** 머리마다 로고와 머리를 찾는 선택자. trim 은 로고 상자 오른쪽의 빈 자리(폭의 몫) —
 *  젠틀몬스터 워드마크는 206 판에서 글자가 203 에서 끝납니다. */
const FIND: Record<Id, { logo: string; bar: string; trim: number }> = {
  "gentle-monster": {
    logo: ".site-bar-gm > span",
    bar: ".site-bar",
    trim: 3 / 206,
  },
  tamburins: { logo: ".site-bar-tam > span", bar: ".site-bar", trim: 0 },
  nudake: { logo: ".nud-mock-logo", bar: ".nud-mock-bar", trim: 0 },
};

/** 로고 끝과 단추 사이 */
const GAP = 10;

export function MockSwitch({ here }: { here: Id }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  /* 로고 오른쪽 끝·세로 가운데와 머리 바닥을 재서 CSS 변수로 건넵니다.
     기기 폭이 바뀌거나 머리가 다시 그려지면 다시 잽니다. */
  useEffect(() => {
    const el = box.current;
    const page = el?.parentElement;
    if (!el || !page) return;
    const find = FIND[here];

    const place = () => {
      const logo = page.querySelector(find.logo);
      const bar = page.querySelector(find.bar);
      if (!logo || !bar) return;
      const at = el.getBoundingClientRect();
      const l = logo.getBoundingClientRect();
      const b = bar.getBoundingClientRect();
      el.style.setProperty(
        "--px",
        `${l.right - l.width * find.trim - at.left + GAP}px`,
      );
      el.style.setProperty("--py", `${l.top + l.height / 2 - at.top}px`);
      el.style.setProperty("--bar", `${b.bottom - at.top}px`);
      el.dataset.ready = "";
    };

    place();
    const watch = new ResizeObserver(place);
    watch.observe(page);
    window.addEventListener("resize", place);
    return () => {
      watch.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [here]);

  /* 바깥을 누르면 접힙니다. */
  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  return (
    <div ref={box} className="mock-switch" data-open={open || undefined}>
      <button
        type="button"
        className="mock-switch-plus"
        aria-label={open ? "다른 화면 목록 닫기" : "다른 화면 보기"}
        aria-expanded={open}
        onClick={() => setOpen((now) => !now)}
      >
        {/* 아래를 가리키는 세모. 펼쳐지면 뒤집혀 위를 가리킵니다.
            단추 상자를 통째로 차지해 테두리 원과 한 점에서 가운데를 맞춥니다. */}
        <svg viewBox="0 0 16 16" aria-hidden>
          <path d="M2.9 5.45 H13.1 L8 11.15 Z" fill="currentColor" />
        </svg>
      </button>

      <nav className="mock-switch-list" aria-label="다른 화면">
        {MOCKS.map((mock) => {
          const now = mock.id === here;
          return (
            <Link
              key={mock.id}
              href={`/m/${mock.id}`}
              className="mock-switch-item"
              data-now={now || undefined}
              aria-current={now ? "page" : undefined}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              <span className="mock-switch-name">{mock.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
