import "@/app/v2.css";

import { V2_COPY } from "@/app/v2-copy";
import { Deck } from "@/app/deck";
import { CopyProvider } from "@/components/copy";

/**
 * 두 번째 판
 *
 * 지금 쓰는 덱과 같은 장·같은 글을 그대로 세우되, 디자인만 따로 잡아 보는
 * 자리입니다. 판을 흔들어 보고 마음에 들면 그때 옮깁니다.
 *
 * 장은 복제하지 않고 한 벌을 나눠 씁니다 — 글이 두 벌이면 한쪽만 고치는
 * 사고가 납니다. 달라지는 것은 `v2.css` 한 장뿐이고, 그 줄들은 모두
 * `.v2` 아래에 있어 지금 쓰는 덱에는 닿지 않습니다.
 */
export default function V2() {
  return (
    <CopyProvider value={V2_COPY}>
      <div className="polished v2">
        <Deck under="v2" />
      </div>
    </CopyProvider>
  );
}
