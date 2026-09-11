import "@/app/v2.css";
import "@/app/v3.css";

import { Deck } from "@/app/deck";
import { V3_COPY } from "@/app/v3-copy";
import { CopyProvider } from "@/components/copy";

/**
 * 세 번째 판
 *
 * 지금 쓰는 판(`/`)을 그대로 복제해 세운 자리입니다 — 같은 장, 같은 글,
 * 같은 글씨. 여기서 판을 흔들어 보고 마음에 들면 그때 옮깁니다.
 * 달라지는 것은 `v3.css` 와 `v3-copy.ts` 뿐입니다.
 */
export default function V3() {
  return (
    <CopyProvider value={V3_COPY}>
      <div className="polished v2 v3">
        <Deck next third under="v3" />
      </div>
    </CopyProvider>
  );
}
