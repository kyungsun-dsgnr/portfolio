"use client";

/** 7장 — 케이스 표지 (11장 예정) */

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

type Props = {
  /** 64px 헤드라인. 대문자 변환은 CSS 가 합니다. 줄바꿈은 부르는 쪽에서 넣습니다. */
  title: ReactNode;
  /** 제목 아래 한 줄. 이 케이스가 무엇을 무엇으로 옮기는지 적습니다.
      세 케이스 표지가 모두 3행 첫머리의 같은 자리에 답니다. */
  subtitle?: ReactNode;
  /** 브랜드 로고. 원본이 333×110(2칼럼 × 1행)에 맞춰 그려져 있습니다. */
  logo?: { src: string; alt: string };
  /** 로고 그림이 없을 때 같은 자리에 세우는 글자 로고 */
  wordmark?: string;
  body: ReactNode;
  /** 우측을 채울 것. 없으면 회색 자리로 둡니다. */
  visual?: ReactNode;
  /** 로고 위 두 행(1~2단)에 들어가는 것. 지금은 탬버린즈 표지의 제품 카드가 씁니다. */
  aside?: ReactNode;
  /** 비주얼 판 마지막 행에 잠깐 떴다 물러나는 안내 한 줄 */
  note?: string;
};

/** 케이스 한 장 — 좌측에 제목·로고·설명, 우측에 큰 비주얼 */
export function SceneCase({
  title,
  subtitle,
  logo,
  wordmark,
  body,
  visual,
  aside,
  note,
}: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-span-4 row-start-1 row-span-2">
        {title}
      </h2>

      {subtitle && (
        <h3
          className="type-title rise self-start col-span-4 row-start-3"
          style={{ "--delay": "0.06s" } as CSSProperties}
        >
          {subtitle}
        </h3>
      )}

      {aside && (
        <div
          className="rise col-span-2 row-start-3 row-span-2"
          style={{ "--delay": "0.08s" } as CSSProperties}
        >
          {aside}
        </div>
      )}

      {!logo && wordmark && (
        <div
          className="rise flex items-center col-span-2 row-start-5"
          style={{ "--delay": "0.1s" } as CSSProperties}
        >
          <span className="case-wordmark">{wordmark}</span>
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
        className="rise relative col-span-4 col-start-5 row-start-1 row-span-6"
        style={{ "--delay": "0.22s" } as CSSProperties}
      >
        {visual ?? <div className="h-full w-full bg-[var(--placeholder)]" />}

        {/* 장에 들어설 때 붙었다가 벗어나면 떨어져, 다시 들어설 때 새로 떠오릅니다. */}
        {note && inView && (
          <p className="center-note" data-last-row>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
