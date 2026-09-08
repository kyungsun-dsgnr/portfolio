/**
 * 두 번째 판에서만 갈리는 문구
 *
 * 지금 쓰는 문구(`POLISHED`) 위에 이 표를 덮습니다 — 여기 적힌 열쇠만
 * 다른 글로 서고, 나머지는 그대로 지나갑니다.
 *
 * 줄바꿈(`\n`)은 `v2.css` 의 `white-space: pre-line` 이 받아 실제 줄로 세웁니다.
 */

import { POLISHED } from "@/app/copy";
import type { CopyMap } from "@/components/copy";

export const V2_COPY: CopyMap = {
  ...POLISHED,
  /* 쉼표에서 한 번 끊어 두 줄로 세웁니다. */
  "One gift, across multiple screens": "One Gift,\nAcross Multiple Screens",
};
