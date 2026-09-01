"use client";

/**
 * 22장 — Write Your Message
 *
 * 카드를 고르고 말을 적는 자리. 화면 설명 대신 카드 한 장을 크게 둡니다.
 * 고른 카드가 곧 화면이고, 적히는 말이 곧 인터페이스입니다.
 */

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 고를 수 있는 카드 넷. 누데이크 결에 맞춰 종이와 잉크만 다릅니다. */
const CARDS = [
  { id: "art", label: "Blue Monk", art: "/images/nudake-bluemonk.png" },
  { id: "ivory", label: "Ivory", tone: "ivory" },
  { id: "ink", label: "Ink", tone: "ink" },
  { id: "grey", label: "Ash", tone: "grey" },
];

/** 카드에 적히는 말. 한 글자씩 그어집니다. */
const MESSAGE = "좋은 날에 함께 있어 줘서 고마워요.";
/** 한 글자를 적는 데 걸리는 시간 */
const TYPE_MS = 90;

export function SceneNudakeWrite() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [pick, setPick] = useState(0);
  /** 지금까지 적힌 글자 수 */
  const [typed, setTyped] = useState(0);
  const timer = useRef(0);

  /* 장에 들어서면 처음부터 다시 적습니다. 카드를 바꿔도 마찬가지입니다. */
  useEffect(() => {
    window.clearInterval(timer.current);
    if (!inView) {
      const back = window.setTimeout(() => setTyped(0), 0);
      return () => clearTimeout(back);
    }

    const start = window.setTimeout(() => {
      setTyped(0);
      timer.current = window.setInterval(() => {
        setTyped((n) => {
          if (n >= MESSAGE.length) {
            window.clearInterval(timer.current);
            return n;
          }
          return n + 1;
        });
      }, TYPE_MS);
    }, 700);

    return () => {
      clearTimeout(start);
      window.clearInterval(timer.current);
    };
  }, [inView, pick]);

  const card = CARDS[pick];

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Write Your Message
      </h2>

      {/* 고르는 카드. 한 장을 크게 두고, 아래에 나머지를 늘어놓습니다. */}
      <div className="nud-write rise col-start-4 col-span-2 row-start-2 row-span-4">
        <figure className="nud-face" data-tone={card.tone ?? "art"}>
          {card.art && (
            <span className="nud-face-art">
              <Image
                src={card.art}
                alt=""
                fill
                sizes="25vw"
                className="object-cover"
              />
            </span>
          )}

          <span className="nud-face-logo">NUDAKE</span>

          <p className="nud-face-text">
            {MESSAGE.slice(0, typed)}
            <i data-done={typed >= MESSAGE.length || undefined} aria-hidden />
          </p>

          <span className="nud-face-date">28 June 2026</span>
        </figure>

        <div className="nud-picks">
          {CARDS.map((one, i) => (
            <button
              key={one.id}
              type="button"
              className="nud-pick"
              data-tone={one.tone ?? "art"}
              data-on={pick === i || undefined}
              aria-label={one.label}
              onClick={() => setPick(i)}
            >
              {one.art && (
                <Image
                  src={one.art}
                  alt=""
                  fill
                  sizes="8vw"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        className="issue rise col-start-1 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        <span className="card-index">01</span>
        <h3 className="type-title">Card</h3>
        <p className="type-body">
          입력창을 열기 전에 카드를 먼저 고릅니다. 무엇에 적을지가 정해져야 무엇을
          적을지가 떠오릅니다.
        </p>
      </div>

      <div
        className="issue rise col-start-7 col-span-2 row-start-2 row-span-2"
        style={{ "--delay": "0.26s" } as CSSProperties}
      >
        <span className="card-index">02</span>
        <h3 className="type-title">Message</h3>
        <p className="type-body">
          적는 자리가 곧 카드 위입니다. 폼 필드가 아니라 카드에 적히는 것으로
          보여야 그다음 행동이 이어집니다.
        </p>
      </div>

      <div
        className="issue rise col-start-7 col-span-2 row-start-5 row-span-2"
        style={{ "--delay": "0.34s" } as CSSProperties}
      >
        <span className="card-index">03</span>
        <h3 className="type-title">Ready to Insert</h3>
        <p className="type-body">
          저장 대신 &lsquo;넣기&rsquo;로 넘어갑니다. 적은 카드는 아직 선물 밖에
          있고, 다음 장에서 안으로 들어갑니다.
        </p>
      </div>
    </div>
  );
}
