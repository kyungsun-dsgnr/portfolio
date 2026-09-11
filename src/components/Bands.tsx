/**
 * 세 번째 판의 위아래 띠
 *
 * 판의 위아래 여백(60) 안에 앉는 잔글씨입니다 —
 *   위: 하는 일 · 지금 갈래 #몇 장째 ── 포트폴리오 · 해
 *   아래: 이름 ── 쪽번호
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
  /* 이 장이 어느 갈래의 몇 장째인지 — 주소(`nudake/03`)로 압니다. */
  const [here, page = ""] = (SLUGS[id] ?? "").split("/");
  const brand = BRANDS.find((one) => one.at === here);

  return (
    <>
      <div className="band band-top" aria-hidden>
        {/* 하는 일 ── 지금 갈래와 그 갈래 안의 몇 장째(주소의 번호) */}
        <p className="band-cell col-start-1 col-span-3">
          <span>UX</span>
          <i className="band-rule" />
          <span>
            {brand?.name}{" "}
            {/^\d+$/.test(page)
              ? `#${no(Number(page))}`
              : page.charAt(0).toUpperCase() + page.slice(1)}
          </span>
        </p>

        <p className="band-cell band-right col-start-8">
          <span>Portfolio</span>
          <span>2026</span>
        </p>
      </div>

      <div className="band band-bottom" aria-hidden>
        <p className="band-cell col-start-1 col-span-3">
          <span>Park Kyungsun</span>
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
