"use client";

/**
 * 25장 — From Information to Emotion
 *
 * 마무리. 무엇이 무엇으로 바뀌었는지 셋만 적고 끝냅니다.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const CHANGES = [
  {
    index: "01",
    from: "Input",
    to: "Gesture",
    body: "메시지 입력을 손이 이미 아는 행동으로 옮겼습니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    from: "Option",
    to: "Composition",
    body: "부가 옵션이던 카드를 선물 구성의 일부로 두었습니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    from: "Checkout",
    to: "Giving",
    body: "구매 완료를 건네는 순간으로 바꾸었습니다.",
    place: "col-start-7 col-span-2",
  },
];

export function SceneNudakeClosing() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-start-1 col-span-4 row-start-1 row-span-2">
        From Information
        <br />
        to Emotion
      </h2>

      <p
        className="type-body rise col-start-6 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        기능을 더한 것이 아니라, 이미 하던 행동을 화면 안으로 들여왔습니다.
        선물은 고르는 것에서 끝나지 않고 건네며 완성됩니다.
      </p>

      {CHANGES.map((one, i) => (
        <div
          key={one.index}
          className={`nud-change rise ${one.place} row-start-4 row-span-2`}
          style={{ "--delay": `${0.2 + i * 0.1}s` } as CSSProperties}
        >
          <span className="card-index">{one.index}</span>

          <p className="nud-change-pair">
            <s>{one.from}</s>
            <i aria-hidden />
            <b>{one.to}</b>
          </p>

          <p className="type-body">{one.body}</p>
        </div>
      ))}

      <p
        className="type-title rise col-start-6 col-span-3 row-start-6 text-right"
        style={{ "--delay": "0.5s" } as CSSProperties}
      >
        A gift is completed
        <br />
        when it is handed over.
      </p>
    </div>
  );
}
