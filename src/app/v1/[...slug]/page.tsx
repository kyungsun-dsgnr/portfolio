import { POLISHED } from "@/app/copy";
import { Deck } from "@/app/deck";
import { SLUG_LIST } from "@/app/slugs";
import { CopyProvider } from "@/components/copy";

/**
 * 첫 판의 장별 주소
 *
 * 지금 쓰는 덱과 같은 표를 쓰되 앞에 `v1` 이 붙습니다 — `/v1/nudake/03` 처럼요.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUG_LIST.map((slug) => ({ slug: slug.split("/") }));
}

export default function Page() {
  return (
    <CopyProvider value={POLISHED}>
      <div className="polished">
        <Deck under="v1" />
      </div>
    </CopyProvider>
  );
}
