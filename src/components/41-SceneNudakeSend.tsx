"use client";

/**
 * 누데이크 06 — 마지막 세 걸음
 *
 * 앞 장(`One Flow, Four Moments`)이 네 화면을 늘어놓았다면, 이 장은 그중
 * 한 순간만 크게 봅니다 — 다 쓴 엽서가 봉투에 담기고, 봉투가 닫히고,
 * 손을 떠나는 3초입니다. 선물을 보내는 마음이 가장 크게 움직이는 자리라
 * 화면 하나만 세우고 글은 왼쪽에 조용히 둡니다.
 *
 * 판은 18장 표지와 같은 갈래입니다 — 제목·글은 왼쪽 넉 단,
 * 화면은 오른쪽 넉 단 전 행.
 *
 * 화면은 장에 들어설 때마다 처음부터 다시 돕니다. 한 번 보고 지나가는 자리라
 * 되돌아왔을 때 이미 끝나 있으면 무슨 일이 있었는지 알 수 없습니다.
 */

import type { CSSProperties } from "react";

import { NudakeMockCompose } from "@/components/NudakeComposeScreen";
import { useInView } from "@/components/useInView";

/* 세 걸음. 화면 안에서 실제로 일어나는 차례 그대로입니다. */
const BEATS = [
  {
    no: "01",
    name: "담기다",
    body: "쓴 글이 그대로 봉투 안으로 내려앉습니다",
  },
  {
    no: "02",
    name: "닫히다",
    body: "봉투가 닫히며 고른 것과 쓴 것이 한 덩이가 됩니다",
  },
  {
    no: "03",
    name: "떠나다",
    body: "손을 떠나 받는 사람에게 갑니다",
  },
];

export function SceneNudakeSend() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        The Last Three Seconds
      </h2>

      <p
        className="type-body rise self-start col-start-1 col-span-3 row-start-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        선물의 인상은 마지막 3초에 정해집니다. 결제가 끝나는 소리 대신, 쓴 글이
        봉투에 담기고 봉투가 손을 떠나는 장면을 남깁니다.
      </p>

      {/* 세 걸음. 화면 왼쪽에 낮게 깔립니다. */}
      <div className="nud-beats rise col-start-1 col-span-4 row-start-4 row-span-3">
        {BEATS.map((beat, i) => (
          <div
            key={beat.no}
            className="nud-beat nud-ruled"
            style={{ "--delay": `${0.18 + i * 0.08}s` } as CSSProperties}
          >
            <p className="steps-no">{beat.no}</p>
            <h3 className="steps-step">{beat.name}</h3>
            <p className="steps-kind">{beat.body}</p>
          </div>
        ))}
      </div>

      {/* 화면 하나. 장에 들어설 때마다 처음부터 다시 돕니다. */}
      <div
        className="nud-stage col-start-5 col-span-4 row-start-1 row-span-6"
        aria-hidden
      >
        {inView ? <NudakeMockCompose step="sent" /> : null}
      </div>
    </div>
  );
}
