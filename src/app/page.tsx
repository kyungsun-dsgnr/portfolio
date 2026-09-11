import "@/app/v2.css";

import { Deck } from "@/app/deck";
import { V2_COPY } from "@/app/v2-copy";
import { CopyProvider } from "@/components/copy";

/**
 * 지금 쓰는 덱
 *
 * 두 번째 판이 기본입니다 — 글씨(Work Sans · Pretendard)와 몇 장의 결이
 * 여기서 갈립니다. 손보기 전의 판은 `/v1` 에 그대로 두었습니다.
 */
export default function Home() {
  return (
    <CopyProvider value={V2_COPY}>
      <div className="polished v2">
        <Deck next />
      </div>
    </CopyProvider>
  );
}
