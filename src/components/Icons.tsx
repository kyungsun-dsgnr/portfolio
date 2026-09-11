/**
 * 판 위의 표 한 벌
 *
 * 목업 안의 표는 각 브랜드의 실제 화면에서 온 것이라 그대로 두고,
 * 판(덱)이 제 목소리로 쓰는 표만 여기 모읍니다.
 *
 * 결은 Iconsax 의 Linear 갈래를 따릅니다 — 24 판, 1.5 굵기, 둥근 끝과 이음.
 * 그 집안의 글자꼴처럼 모서리가 부드럽게 말립니다.
 */

const LINE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** 오른쪽 화살표 — 전에서 후로 건너가는 표 */
export function IconArrowRight() {
  return (
    <svg {...LINE}>
      <path d="M14.43 5.93 20.5 12l-6.07 6.07" />
      <path d="M3.5 12h16.83" />
    </svg>
  );
}
