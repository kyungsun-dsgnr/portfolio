import { POLISHED } from "@/app/copy";
import { Deck } from "@/app/deck";
import { CopyProvider } from "@/components/copy";

/**
 * 지금 쓰는 덱
 *
 * 글은 2026-09-07 제안서대로 손본 것을 씁니다. 손보기 전의 판은 `/before`.
 */
export default function Home() {
  return (
    <CopyProvider value={POLISHED}>
      <div className="polished">
        <Deck />
      </div>
    </CopyProvider>
  );
}
