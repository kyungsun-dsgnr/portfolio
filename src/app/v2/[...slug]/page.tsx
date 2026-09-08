import "@/app/v2.css";

import { V2_COPY } from "@/app/v2-copy";
import { Deck } from "@/app/deck";
import { SLUG_LIST } from "@/app/slugs";
import { CopyProvider } from "@/components/copy";

/**
 * 두 번째 판의 장별 주소
 *
 * 지금 쓰는 덱과 같은 표를 쓰되 앞에 `v2` 가 붙습니다 —
 * `/v2/nudake/03` 처럼요. 두 판의 같은 장을 나란히 열어 견줄 수 있습니다.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUG_LIST.map((slug) => ({ slug: slug.split("/") }));
}

export default function Page() {
  return (
    <CopyProvider value={V2_COPY}>
      <div className="polished v2">
        <Deck under="v2" />
      </div>
    </CopyProvider>
  );
}
