"use client";

/**
 * 카드를 잡아 패키지 안으로 끌어 넣는 조각.
 *
 * 08장 PERSONALIZE 자리에 들어갑니다. 실제 선물을 건네며 메시지를 함께
 * 넣는 행동을 그대로 옮긴 것이라, 장식이 아니라 완료의 신호입니다.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

/** 카드가 이 거리 안까지 오면 패키지가 받아들입니다(px). */
const CATCH = 150;

export function NudakeInsertCard({
  live = true,
  message = "좋은 날에 함께 있어 줘서 고마워요.",
}: {
  /** 장을 벗어나면 처음으로 돌려 둡니다. */
  live?: boolean;
  message?: string;
} = {}) {
  const slot = useRef<HTMLDivElement>(null);
  /** 카드가 손을 따라간 거리(px) */
  const [at, setAt] = useState({ x: 0, y: 0 });
  const [held, setHeld] = useState(false);
  const [done, setDone] = useState(false);
  const from = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (live) return;
    const back = window.setTimeout(() => {
      setAt({ x: 0, y: 0 });
      setHeld(false);
      setDone(false);
    }, 0);
    return () => clearTimeout(back);
  }, [live]);

  const onDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (done) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      from.current = { x: event.clientX - at.x, y: event.clientY - at.y };
      setHeld(true);
    },
    [at, done],
  );

  const onMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!held) return;
      setAt({
        x: event.clientX - from.current.x,
        y: event.clientY - from.current.y,
      });
    },
    [held],
  );

  /* 놓은 자리가 주머니 입구에 가까우면 들어가고, 아니면 제자리로 돌아옵니다. */
  const onUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setHeld(false);

    const card = event.currentTarget.getBoundingClientRect();
    const mouth = slot.current?.getBoundingClientRect();
    if (!mouth) return setAt({ x: 0, y: 0 });

    const gone = Math.hypot(
      card.left + card.width / 2 - (mouth.left + mouth.width / 2),
      card.top + card.height / 2 - (mouth.top + mouth.height / 2),
    );

    if (gone < CATCH) setDone(true);
    else setAt({ x: 0, y: 0 });
  }, []);

  return (
    <div className="nud-insert" data-done={done || undefined}>
      {/* 패키지. 뒷면 → 카드 → 앞면 → 덮개 순서로 겹칩니다. */}
      <div className="nud-pack">
        <span className="nud-pack-back" aria-hidden />
        <div className="nud-pack-slot" ref={slot} aria-hidden />

        <div className="nud-pack-inner" aria-hidden>
          <span className="nud-inserted">
            <em>NUDAKE</em>
            <b>{message}</b>
          </span>
        </div>

        <span className="nud-pack-front" aria-hidden>
          NUDAKE
        </span>
        <span className="nud-pack-lid" aria-hidden />
      </div>

      <div
        className="nud-drag"
        data-held={held || undefined}
        role="button"
        tabIndex={0}
        aria-label="카드를 패키지에 넣기"
        style={{ translate: `${at.x}px ${at.y}px` } as CSSProperties}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setDone(true);
          }
        }}
      >
        <em>NUDAKE</em>
        <b>{message}</b>
        <span>28 June 2026</span>
      </div>

      <p className="nud-insert-hint" aria-hidden>
        {done ? "Ready to send" : "카드를 패키지 안으로"}
      </p>
    </div>
  );
}
