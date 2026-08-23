"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

type Props = {
  /** 64px 헤드라인. 대문자 변환은 CSS 가 합니다. */
  title: string;
  /** 브랜드 로고. 원본이 333×110(2칼럼 × 1행)에 맞춰 그려져 있습니다. */
  logo?: { src: string; alt: string };
  body: ReactNode;
};

/** 케이스 한 장 — 좌측에 제목·로고·설명, 우측에 큰 비주얼 */
export function SceneCase({ title, logo, body }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-span-4 row-start-1 row-span-2">{title}</h2>

      {logo && (
        <div
          className="rise relative col-span-2 row-start-5"
          style={{ "--delay": "0.1s" } as CSSProperties}
        >
          <Image src={logo.src} alt={logo.alt} fill sizes="24vw" className="object-contain" />
        </div>
      )}

      <p
        className="type-body rise col-span-3 row-start-6"
        style={{ "--delay": "0.16s" } as CSSProperties}
      >
        {body}
      </p>

      {/* 작업 이미지 자리 */}
      <div
        className="rise col-span-4 col-start-5 row-start-1 row-span-6 bg-[var(--placeholder)]"
        style={{ "--delay": "0.22s" } as CSSProperties}
      />
    </div>
  );
}
