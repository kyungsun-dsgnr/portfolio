import "@/app/v2.css";

import { Deck } from "@/app/deck";
import { V2_COPY } from "@/app/v2-copy";
import { CopyProvider } from "@/components/copy";

/**
 * 두 번째 판
 *
 * 세 번째 판이 기본이 되기 전까지 쓰던 판입니다 — Work Sans · Pretendard,
 * 카드가 돌지 않는 누데이크 장들. 그대로 남겨 둡니다.
 */
export default function V2() {
  return (
    <CopyProvider value={V2_COPY}>
      <div className="polished v2">
        <Deck next under="v2" />
      </div>
    </CopyProvider>
  );
}
