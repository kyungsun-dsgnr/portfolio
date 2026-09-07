import { POLISHED } from "@/app/copy";
import { Deck } from "@/app/deck";
import { SLUG_LIST } from "@/app/slugs";
import { CopyProvider } from "@/components/copy";

/**
 * 장마다 붙는 주소
 *
 * `/intro`, `/intro/01`, `/work`, `/nudake/03` … 표에 적힌 것만 만듭니다.
 * 갈래의 첫 장은 번호 없이 경로만 씁니다.
 * 어느 주소로 들어와도 덱 한 벌이 서고, 덱이 주소를 읽어 그 장에서 시작합니다.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUG_LIST.map((slug) => ({ slug: slug.split("/") }));
}

export default function Page() {
  return (
    <CopyProvider value={POLISHED}>
      <div className="polished">
        <Deck />
      </div>
    </CopyProvider>
  );
}
