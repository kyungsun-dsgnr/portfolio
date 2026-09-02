"use client";

/**
 * 19장 — An Experience Built Around Space
 *
 * 브랜드를 이해했다는 것만 보이는 장입니다.
 * "스토어가 적어서 문제" 라고 말하지 않습니다 — 공간 중심의 경험은
 * 강한 자산이고, 그 밖에서 브랜드를 만나는 방식에 가능성이 있다는 데까지만.
 * 그리드 7번 — 2단짜리 넷을 가로로.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 누데이크의 경험을 이루는 넷. 더해져야 하나가 됩니다. */
const TERMS = [
  { key: "space", name: "Space", body: "공간이 먼저 말을 겁니다." },
  { key: "product", name: "Product", body: "디저트와 티가 그 말을 잇습니다." },
  { key: "visual", name: "Visual", body: "이미지가 브랜드의 결을 만듭니다." },
  { key: "package", name: "Package", body: "손에 남는 것이 마지막을 맡습니다." },
];

/* 접점의 성격을 적는 말입니다. 단점을 적는 자리가 아닙니다. */
const KEYS = ["Physical Experience", "Limited Touchpoint", "Brand Immersion"];

export function SceneNudakeContext() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        An Experience
        <br />
        Built Around Space
      </h2>

      <p
        className="type-body rise col-start-6 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        누데이크의 강한 브랜드 경험은 공간과 제품, 패키지 같은 물리적 접점을
        중심으로 만들어집니다.
      </p>

      {/* Space + Product + Visual + Package = Nudake Experience */}
      <div
        className="nud-formula rise col-start-1 col-span-8 row-start-3 row-span-2"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        {TERMS.map((term, i) => (
          <div className="nud-term" key={term.key}>
            {i > 0 && (
              <span className="nud-op" aria-hidden>
                +
              </span>
            )}

            <div className="nud-term-body">
              <h3>{term.name}</h3>
              <p className="type-body">{term.body}</p>
            </div>
          </div>
        ))}

        <div className="nud-term" data-sum>
          <span className="nud-op" aria-hidden>
            =
          </span>

          <div className="nud-term-body">
            <h3>Nudake Experience</h3>
          </div>
        </div>
      </div>

      <p
        className="type-body rise col-start-1 col-span-4 row-start-5"
        style={{ "--delay": "0.42s" } as CSSProperties}
      >
        이러한 경험은 강력한 브랜드 자산인 동시에,
        <br />
        물리적 공간 밖에서 브랜드를 경험하는 방식에 새로운 가능성을 만듭니다.
      </p>

      <p
        className="nud-keys rise col-start-1 col-span-5 row-start-6"
        style={{ "--delay": "0.52s" } as CSSProperties}
      >
        {KEYS.map((key) => (
          <span key={key}>{key}</span>
        ))}
      </p>
    </div>
  );
}
