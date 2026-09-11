/**
 * 장마다 붙는 주소
 *
 * 덱은 한 장짜리 스크롤이지만, 각 장이 제 주소를 갖습니다.
 * 굴려서 넘길 때마다 주소창이 따라 바뀌고, 그 주소로 바로 들어오면
 * 그 장에서 시작합니다.
 *
 * 여기가 하나뿐인 원본입니다 — 빌드 때 만들 주소 목록도, 굴릴 때 갈아 끼울
 * 주소도 이 표에서 나옵니다. 장을 더하거나 뺄 때 이 표도 함께 손봐야 합니다.
 * 짝이 맞는지는 개발 중에 덱이 스스로 확인합니다.
 */

/** 장 id → 주소. 갈래의 첫 장은 번호 없이 경로만 쓰고(`/nudake`),
 *  그 뒤가 `/01` 부터입니다 — 판 위에 적히는 쪽번호와 같은 수가 됩니다.
 *  덱에 선 차례대로 적습니다. */
export const SLUGS: Record<string, string> = {
  switch: "intro",
  statement: "intro/01",
  principles: "intro/02",
  closing: "intro/03",
  work: "work",

  "gentle-monster-paper": "gentle-monster",
  "gentle-monster-problem": "gentle-monster/01",
  "gentle-monster-why": "gentle-monster/02",
  "gentle-monster-explore": "gentle-monster/03",
  "gentle-monster-after": "gentle-monster/04",

  tamburins: "tamburins",
  "tamburins-flow": "tamburins/01",
  "tamburins-screens": "tamburins/02",
  "tamburins-shift": "tamburins/03",
  "tamburins-one": "tamburins/04",

  nudake: "nudake",
  "nudake-context-2": "nudake/01",
  "nudake-signs-2": "nudake/02",
  "nudake-gap-3": "nudake/03",
  "nudake-gap-4": "nudake/04",
  "nudake-flow": "nudake/05",
  /* 세 번째 판에만 서는 장. 뒤 장의 번호는 건드리지 않습니다. */
  "nudake-flow-full": "nudake/05b",
  "nudake-send": "nudake/06",
};

/* 내려 둔 논리 장들의 주소입니다. 그 장을 다시 세울 때 이 줄도 함께 풉니다.
   "gm-limit": "gentle-monster/…", "gm-logic": …, "tam-map": …, "tam-reframe": …,
   "tam-after": …, "nud-place": …, "nud-logic": …, takeaway: "takeaway" */

/** 주소 → 장 id. 들어온 주소로 어디서 시작할지 찾을 때 씁니다. */
export const BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUGS).map(([id, slug]) => [slug, id]),
);

/** 빌드 때 만들어 둘 경로 전부 */
export const SLUG_LIST = Object.values(SLUGS);
