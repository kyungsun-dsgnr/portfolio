"use client";

/**
 * 맺음 둘 — 고맙습니다
 *
 * 11번 판을 눕힌 꼴입니다 — 큰 문장과 인사가 온 너비로 1행부터, 바닥 6행에 이름(3–4단) ·
 * 하는 일(5–6단) · 연락처(7–8단)가 끝 단에 맞춰 가로로 섭니다. 장은 어둡습니다.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { useInView } from "@/components/useInView";

const MAIL = "sunnee.dsgnr@gmail.com";

export function SceneThanks() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  /* 메일 주소 위에서는 기본 커서를 감추고 6장의 VIEW 처럼 둥근 COPY 가
     따라다닙니다. 누르면 주소가 복사되고 잠시 COPIED 로 답합니다. */
  const cursorRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const back = window.setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(back);
  }, [copied]);

  function moveCursor(event: PointerEvent<HTMLElement>) {
    const el = cursorRef.current;
    if (!el) return;
    const at = `calc(${event.clientX}px - 50%) calc(${event.clientY}px - 50%)`;
    el.style.translate = at;
    /* 글이 앉는 가운데 원도 같은 자리로 — 섞지 않으려 따로 세운 것입니다. */
    if (coreRef.current) coreRef.current.style.translate = at;
  }

  function enter(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    moveCursor(event);
    setShowCursor(true);
  }

  async function copy(event: MouseEvent<HTMLAnchorElement>) {
    /* 메일 앱을 열지 않고 주소만 손에 쥐어 줍니다. */
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(MAIL);
      setCopied(true);
    } catch {
      /* 클립보드가 막힌 자리면 원래대로 메일 앱을 엽니다. */
      window.location.href = `mailto:${MAIL}`;
    }
  }

  return (
    <div
      ref={ref}
      className="page-grid thanks"
      data-visible={inView || undefined}
    >
      {/* 한 문장 — 이 덱이 한 일 */}
      {/* 한 문장 — 이 장의 주인공. 인사는 그 아래 반 크기로 가까이 붙습니다. */}
      <div className="thanks-lead rise col-start-1 col-span-8 row-start-1 row-span-5">
        <p className="type-lead">
          I translate familiar behaviors, senses, and expectations
          <br />
          into digital experiences that feel natural
          <br />
          from the first interaction.
        </p>
        <p className="thanks-note">
          Thank you for taking the time to explore my work.
        </p>
      </div>

      {/* 바닥 한 줄 — 이름 · 하는 일 · 연락처가 라벨을 이고 가로로 섭니다. */}
      {[
        {
          label: "Name",
          value: "Park Kyungsun",
          place: "col-start-3 col-span-2",
        },
        {
          label: "Role",
          value: "Product Designer",
          place: "col-start-5 col-span-2",
        },
        {
          label: "Contact",
          value: MAIL,
          place: "col-start-7 col-span-2",
          mail: true,
        },
      ].map((one, i) => (
        <div
          key={one.label}
          className={`thanks-cell rise ${one.place} row-start-6`}
          style={{ "--delay": `${0.14 + i * 0.08}s` } as CSSProperties}
        >
          <p className="nud-eyebrow">{one.label}</p>
          {one.mail ? (
            <a
              className="type-body thanks-mail"
              href={`mailto:${one.value}`}
              onClick={copy}
              onPointerEnter={enter}
              onPointerMove={showCursor ? moveCursor : undefined}
              onPointerLeave={() => setShowCursor(false)}
            >
              {one.value}
            </a>
          ) : (
            <p className="type-body">{one.value}</p>
          )}
        </div>
      ))}

      {/* 바깥 원은 아래 색을 뒤집고, 글이 앉는 가운데 원은 따로 서서 섞이지 않습니다. */}
      <div
        ref={cursorRef}
        className="view-cursor"
        data-on={showCursor || undefined}
        aria-hidden
      />
      <div
        ref={coreRef}
        className="view-cursor-core"
        data-on={showCursor || undefined}
        aria-hidden
      >
        {copied ? "Copied" : "Copy"}
      </div>
    </div>
  );
}
