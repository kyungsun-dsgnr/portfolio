import "@/app/v2.css";
import "@/app/v3.css";

import { Deck } from "@/app/deck";
import { SLUG_LIST } from "@/app/slugs";
import { V3_COPY } from "@/app/v3-copy";
import { CopyProvider } from "@/components/copy";

/**
 * 세 번째 판의 장별 주소
 *
 * 지금 쓰는 덱과 같은 표를 쓰되 앞에 `v3` 가 붙습니다 — `/v3/nudake/03` 처럼요.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUG_LIST.map((slug) => ({ slug: slug.split("/") }));
}

export default function Page() {
  return (
    <CopyProvider value={V3_COPY}>
      <div className="polished v2 v3">
        <Deck next third under="v3" />
      </div>
    </CopyProvider>
  );
}
