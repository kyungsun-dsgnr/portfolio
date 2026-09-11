/**
 * 세 번째 판의 위아래 띠
 *
 * 판의 위아래 여백(60) 안에 앉는 잔글씨입니다 —
 *   위: 이름 · 하는 일 ── 지금 갈래(한가운데) ── 포트폴리오 · 해
 *   아래: 연락처 ── 쪽번호
 * 판(.page-grid)과 같은 여덟 단 위에 놓여 글이 단 머리에 맞춰 섭니다.
 * 표지(인트로) · 세 갈래(work) · 맺음 장에는 두지 않습니다 — v3.css 가 감춥니다.
 */

import { SLUGS } from "@/app/slugs";

/** 갈래 셋 — 주소 첫 자리와 머리에 적을 이름 */
const BRANDS = [
  { at: "gentle-monster", name: "Gentle Monster" },
  { at: "tamburins", name: "Tamburins" },
  { at: "nudake", name: "Nudake" },
];

export function Bands({
  id,
  index,
  total,
}: {
  id: string;
  index: number;
  total: number;
}) {
  const no = (n: number) => String(n).padStart(2, "0");
  /* 이 장이 어느 갈래인지 — 주소 첫 자리(`nudake/03` → `nudake`)로 압니다.
     머리에는 그 갈래 이름만 남깁니다. */
  const here = (SLUGS[id] ?? "").split("/")[0];

  return (
    <>
      <div className="band band-top" aria-hidden>
        <p className="band-cell col-start-1 col-span-3">
          <span>Park Kyungsun</span>
          <i className="band-rule" />
          <span>UX</span>
        </p>

        {/* 지금 갈래의 이름 — 머리 한가운데(4–5단 사이)에 섭니다. */}
        {BRANDS.filter((brand) => brand.at === here).map((brand) => (
          <p
            key={brand.at}
            className="band-cell band-center col-start-4 col-span-2"
          >
            <span>{brand.name}</span>
          </p>
        ))}

        <p className="band-cell band-right col-start-8">
          <span>Portfolio</span>
          <span>2026</span>
        </p>
      </div>

      <div className="band band-bottom" aria-hidden>
        <p className="band-cell col-start-1 col-span-3">
          <span>Contact</span>
          <i className="band-dash" />
          <span className="band-mail">sunnee.dsgnr@gmail.com</span>
          <svg viewBox="0 0 12 12" aria-hidden>
            <path
              d="M2.5 9.5 9.5 2.5 M4 2.5h5.5V8"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <p className="band-cell band-right col-start-7 col-span-2">
          <span>
            {no(index + 1)} / {no(total)}
          </span>
        </p>
      </div>
    </>
  );
}
