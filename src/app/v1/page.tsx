import { POLISHED } from "@/app/copy";
import { Deck } from "@/app/deck";
import { CopyProvider } from "@/components/copy";

/**
 * 첫 판
 *
 * 글씨와 몇 장의 결을 손보기 전의 덱입니다. 지금 쓰는 판(`/`)과 견줄 때
 * 씁니다 — 장은 한 벌을 나눠 쓰고, 이 판에는 두 번째 판에만 세운 장들이
 * 서지 않습니다.
 */
export default function V1() {
  return (
    <CopyProvider value={POLISHED}>
      <div className="polished">
        <Deck under="v1" />
      </div>
    </CopyProvider>
  );
}
