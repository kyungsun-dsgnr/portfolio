"use client";

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/** 지금 방식이 막히는 지점 셋 */
const ISSUES = [
  {
    index: "01",
    title: "Needs a Name First",
    body: "국가와 도시를 고를 수 있어야 목록이 열립니다. 어디에 있는지 모르면 첫 단계에서 멈춥니다.",
    place: "col-start-3 col-span-3 row-start-5",
  },
  {
    index: "02",
    title: "No Sense of Distance",
    body: "목록은 거리와 방향을 담지 못합니다. 서울과 도쿄가 얼마나 가까운지 알 수 없습니다.",
    place: "col-start-6 col-span-3 row-start-5",
  },
  {
    index: "03",
    title: "Nothing to Wander",
    body: "고르는 행위만 있고 둘러보는 행위가 없습니다. 우연히 마주칠 여지가 남지 않습니다.",
    place: "col-start-6 col-span-3 row-start-6",
  },
];

/** 문제를 짚는 장 */
export function SceneProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-7 row-start-1 row-span-3">
        The list assumes
        <br />
        you already know where to look.
      </h2>

      <p
        className="type-body rise col-span-2 col-start-7 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        스토어 찾기는 이름을 아는 사람에게만 열려 있습니다.
        <br />
        <br />
        찾으려면 먼저 어디에 있는지 알아야 하고, 알고 있다면 굳이 찾을 이유가 없습니다.
      </p>

      {ISSUES.map((issue, i) => (
        <div
          key={issue.index}
          className={`issue rise ${issue.place}`}
          style={{ "--delay": `${0.18 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{issue.index}</span>
          <h3 className="type-title">{issue.title}</h3>
          <p className="type-body">{issue.body}</p>
        </div>
      ))}
    </div>
  );
}
