/** 세 번째 판의 표지 — 조명·스위치 대신 세 갈래의 정지 화면 셋을 둡니다. */
import Image from "next/image";
import type { CSSProperties } from "react";

/** 세 갈래(젠틀몬스터 · 탬버린즈 · 누데이크)의 대표 장면. 6장 카드와 같은 그림입니다. */
const CARDS = [
  {
    image: "/images/work-gentle-monster.png",
    alt: "Gentle Monster Explore",
    place: "col-start-3 col-span-2",
  },
  {
    image: "/images/work-tamburins.png",
    alt: "Tamburins Compose",
    place: "col-start-5 col-span-2",
  },
  {
    image: "/images/work-nudake.png",
    alt: "Nudake Gift",
    place: "col-start-7 col-span-2",
  },
];

/** 제목과 정지 화면 셋 */
export function SceneCover3() {
  return (
    <div className="page-grid">
      <h1 className="type-display intro-headline reveal col-span-5 row-span-2">
        What We
        <br />
        Already Know
        <br />
        Becomes Interaction
      </h1>

      {/* 우측 텍스트는 세로 중앙이 아니라 각자 행 시작선에 붙습니다. */}
      <h2
        className="type-title reveal col-span-3 col-start-6 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        Designing Digital Experiences
        <br />
        From Sensory and Behavioral Memory
      </h2>

      <div
        className="type-body reveal col-span-3 col-start-6 row-start-2"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        <p>
          빛의 변화, 거리의 감각, 손의 움직임.
          <br />
          이미 알고 있는 감각과 행동의 기억을 바탕으로 디지털 경험을 설계합니다.
        </p>
      </div>

      {/* 6장 카드와 같은 자리(3단부터 두 단씩, 3~6행)에 그림만 둡니다. */}
      {CARDS.map((card, i) => (
        <div
          key={card.image}
          className={`cover-card reveal row-start-3 row-span-4 ${card.place}`}
          style={{ "--delay": `${0.3 + i * 0.08}s` } as CSSProperties}
        >
          <Image
            src={card.image}
            alt={card.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 24vw, 90vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
