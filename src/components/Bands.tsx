/**
 * 세 번째 판의 위아래 띠
 *
 * 판의 여섯 행 위아래에 더한 1/4 행에 앉는 잔글씨입니다 —
 *   위: 이름 · 하는 일 ── 포트폴리오 · 해
 *   아래: 연락처 ── 쪽번호
 * 판(.page-grid)과 같은 여덟 단 위에 놓여 글이 단 머리에 맞춰 섭니다.
 * 표지(인트로)와 맺음 장에는 두지 않습니다 — v3.css 가 그 장에서 감춥니다.
 */

export function Bands({ index, total }: { index: number; total: number }) {
  const no = (n: number) => String(n).padStart(2, "0");
  return (
    <>
      <div className="band band-top" aria-hidden>
        <p className="band-cell col-start-1 col-span-3">
          <span>Park Kyungsun</span>
          <i className="band-rule" />
          <span>UX Designer &middot; Front-end</span>
        </p>
        <p className="band-cell band-right col-start-7 col-span-2">
          <span>Portfolio</span>
          <span>2026</span>
        </p>
      </div>

      <div className="band band-bottom" aria-hidden>
        <p className="band-cell col-start-1 col-span-3">
          <span>Contact</span>
          <i className="band-dash" />
          <span className="band-mail">parkkyungsun@gmail.com</span>
          <svg viewBox="0 0 12 12" aria-hidden>
            <path
              d="M2.5 9.5 9.5 2.5 M4 2.5h5.5V8"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <p className="band-cell band-right col-start-7 col-span-2">
          <span>
            {no(index + 1)} / {no(total)}
          </span>
        </p>
      </div>
    </>
  );
}
