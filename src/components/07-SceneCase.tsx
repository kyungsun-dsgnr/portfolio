"use client";

/** 7장 — 케이스 표지 (11장 예정) */

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

type Props = {
  /** 64px 헤드라인. 대문자 변환은 CSS 가 합니다. */
  title: string;
  /** 브랜드 로고. 원본이 333×110(2칼럼 × 1행)에 맞춰 그려져 있습니다. */
  logo?: { src: string; alt: string };
  body: ReactNode;
  /** 우측을 채울 것. 없으면 회색 자리로 둡니다. */
  visual?: ReactNode;
  /** 로고 위 두 행(1~2단)에 들어가는 것. 지금은 탬버린즈 표지의 제품 카드가 씁니다. */
  aside?: ReactNode;
  /** 화면 한가운데 잠깐 떴다 물러나는 안내 한 줄 */
  note?: string;
};

/** 케이스 한 장 — 좌측에 제목·로고·설명, 우측에 큰 비주얼 */
export function SceneCase({ title, logo, body, visual, aside, note }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-span-4 row-start-1 row-span-2">
        {title}
      </h2>

      {/* 장에 들어설 때마다 다시 떠오르도록 key 를 갈아 끼웁니다. */}
      {note && inView && (
        <p className="center-note" key={String(inView)}>
          {note}
        </p>
      )}

      {aside && (
        <div
          className="rise col-span-2 row-start-3 row-span-2"
          style={{ "--delay": "0.08s" } as CSSProperties}
        >
          {aside}
        </div>
      )}

      {logo && (
        <div
          className="rise relative col-span-2 row-start-5"
          style={{ "--delay": "0.1s" } as CSSProperties}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            sizes="24vw"
            className="object-contain"
          />
        </div>
      )}

      <p
        className="type-body rise col-span-3 row-start-6"
        style={{ "--delay": "0.16s" } as CSSProperties}
      >
        {body}
      </p>

      <div
        className="rise col-span-4 col-start-5 row-start-1 row-span-6"
        style={{ "--delay": "0.22s" } as CSSProperties}
      >
        {visual ?? <div className="h-full w-full bg-[var(--placeholder)]" />}
      </div>
    </div>
  );
}
