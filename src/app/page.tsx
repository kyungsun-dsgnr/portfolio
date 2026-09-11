import "@/app/v2.css";
import "@/app/v3.css";

import { Deck } from "@/app/deck";
import { V3_COPY } from "@/app/v3-copy";
import { CopyProvider } from "@/components/copy";

/**
 * 지금 쓰는 덱
 *
 * 세 번째 판이 기본입니다 — 위아래 여백과 머리·바닥 띠, 카드가 도는 장들이
 * 여기서 갈립니다. 앞선 두 판은 `/v1` · `/v2` 에 그대로 두었습니다.
 */
export default function Home() {
  return (
    <CopyProvider value={V3_COPY}>
      <div className="polished v2 v3">
        <Deck next third />
      </div>
    </CopyProvider>
  );
}
