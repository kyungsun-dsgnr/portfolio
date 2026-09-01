"use client";

/**
 * 23장 — Insert the Card
 *
 * 이 케이스의 시그니처 장면입니다. 카드를 잡아 패키지 안으로 끌어 넣으면
 * 카드가 들어가고 뚜껑이 닫힙니다. 저장 단추 하나로 끝나던 일을
 * '준비를 마쳤다' 는 느낌이 남는 행동으로 바꿉니다.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useInView } from "@/components/useInView";

/** 카드가 이 거리 안까지 오면 패키지가 받아들입니다(도면 px). */
const CATCH = 150;

export function SceneNudakeInsert() {
  const [ref, inView] = useInView<HTMLDivElement>(0.45);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);

  /** 카드가 손을 따라간 거리(px). 놓으면 제자리나 안으로 갑니다. */
  const [at, setAt] = useState({ x: 0, y: 0 });
  const [held, setHeld] = useState(false);
  /** 다 넣었는지 */
  const [done, setDone] = useState(false);
  const from = useRef({ x: 0, y: 0 });

  const reset = useCallback(() => {
    setAt({ x: 0, y: 0 });
    setHeld(false);
    setDone(false);
  }, []);

  /* 장을 벗어나면 처음으로 돌려 둡니다. 다시 들어오면 또 넣어 볼 수 있습니다. */
  useEffect(() => {
    if (inView) return;
    const back = window.setTimeout(reset, 0);
    return () => clearTimeout(back);
  }, [inView, reset]);

  /* 스스로 넣어 보이지는 않습니다. 이 장의 요점은 직접 넣어 보는 것이라,
     먼저 해 버리면 남는 것이 없습니다. */

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
  const onUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
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
    },
    [],
  );

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Insert the Card
      </h2>

      <p
        className="type-body rise col-start-1 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.14s" } as CSSProperties}
      >
        카드를 잡아 패키지 안으로 끌어 넣어 보세요.
        <br />
        <br />
        저장으로 끝나던 걸음을, 잡고 · 옮기고 · 넣고 · 닫는 네 박자로 늘렸습니다.
        끝나는 자리가 화면이 아니라 손에 남습니다.
      </p>

      <div
        ref={stage}
        className="nud-insert rise col-start-3 col-span-4 row-start-2 row-span-5"
        data-done={done || undefined}
      >
        {/* 패키지. 뒷면 → 카드 → 앞면 → 덮개 순서로 겹칩니다. */}
        <div className="nud-pack">
          <span className="nud-pack-back" aria-hidden />

          {/* 카드가 들어가 앉는 자리. 넣었는지 재는 기준이기도 합니다. */}
          <div className="nud-pack-slot" ref={slot} aria-hidden />

          <div className="nud-pack-inner" aria-hidden>
            <span className="nud-inserted">
              <em>NUDAKE</em>
              <b>좋은 날에 함께 있어 줘서 고마워요.</b>
            </span>
          </div>

          <span className="nud-pack-front" aria-hidden>
            NUDAKE
          </span>

          <span className="nud-pack-lid" aria-hidden />
        </div>

        {/* 끌고 가는 카드 */}
        <div
          className="nud-drag"
          data-held={held || undefined}
          role="button"
          tabIndex={0}
          aria-label="카드를 패키지에 넣기"
          style={
            {
              translate: `${at.x}px ${at.y}px`,
            } as CSSProperties
          }
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
          <b>좋은 날에 함께 있어 줘서 고마워요.</b>
          <span>28 June 2026</span>
        </div>

        <p className="nud-insert-hint" aria-hidden>
          {done ? "선물이 준비되었습니다" : "카드를 패키지 안으로"}
        </p>
      </div>

      <div
        className="issue rise col-start-7 col-span-2 row-start-3 row-span-3"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
        <span className="card-index">03</span>
        <h3 className="type-title">Insert</h3>
        <p className="type-body">
          장식이 아니라 완료의 신호입니다. 카드가 안으로 사라지고 덮개가 닫히는
          동안, 사용자는 &lsquo;선물을 준비했다&rsquo;는 상태를 눈으로 확인합니다.
          <br />
          <br />
          젠틀몬스터의 Turn, 탬버린즈의 Place 에 대응하는 이 케이스의 동사입니다.
        </p>
      </div>
    </div>
  );
}
