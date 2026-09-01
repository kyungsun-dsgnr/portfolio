"use client";

/**
 * 21장 — Choose · Write · Insert · Give
 *
 * 그리드 7번(2단짜리 넷을 가로로)에 걸음 넷을 그대로 얹습니다.
 * 이 장의 주인공은 세 번째 걸음 INSERT 입니다.
 */

import Image from "next/image";
import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const STEPS = [
  {
    index: "01",
    title: "Choose",
    body: "선물의 무드에 맞는 카드를 고릅니다.",
    shot: "/images/nudake-card-front.png",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    title: "Write",
    body: "카드를 열어 전하고 싶은 말을 적습니다.",
    shot: "/images/nudake-card.png",
    place: "col-start-3 col-span-2",
  },
  {
    index: "03",
    title: "Insert",
    body: "적은 카드를 패키지 안으로 직접 끌어 넣습니다.",
    shot: "/images/nudake-pouch.png",
    place: "col-start-5 col-span-2",
    lead: true,
  },
  {
    index: "04",
    title: "Give",
    body: "패키지가 닫히며 선물이 완성됩니다.",
    shot: "/images/nudake-scene.png",
    place: "col-start-7 col-span-2",
    full: true,
  },
];

export function SceneNudakeSteps() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1 row-span-2">
        Choose, Write,
        <br />
        Insert, Give
      </h2>

      <p
        className="type-body rise col-start-5 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        저장으로 끝나던 걸음을 하나 더 둡니다. 카드를 잡고, 패키지로 옮기고,
        넣고, 닫는 동안 사용자는 &lsquo;선물을 준비했다&rsquo;는 완료감을
        받습니다.
      </p>

      {STEPS.map((step, i) => (
        <div
          key={step.index}
          className={`nud-step rise ${step.place} row-start-4 row-span-3`}
          data-lead={step.lead || undefined}
          data-full={step.full || undefined}
          style={{ "--delay": `${0.18 + i * 0.09}s` } as CSSProperties}
        >
          <div className="nud-step-shot">
            <Image
              src={step.shot}
              alt=""
              fill
              sizes="25vw"
              className="object-contain"
            />
          </div>

          <span className="card-index">{step.index}</span>
          <h3 className="type-title">{step.title}</h3>
          <p className="type-body">{step.body}</p>
        </div>
      ))}
    </div>
  );
}
