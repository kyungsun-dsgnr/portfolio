/**
 * 지금의 네 화면을 와이어프레임으로 그린 것.
 * 사진과 글을 지우고 덩이와 줄만 남겨, 무엇을 고르는 화면인지가 아니라
 * 몇 번을 옮겨 다녀야 하는지가 먼저 보이게 합니다.
 */

/** 글 한 줄 */
function L({ w, tall }: { w: number; tall?: boolean }) {
  return (
    <span
      className="wf-l"
      data-tall={tall || undefined}
      style={{ width: `${w}%` }}
    />
  );
}

/** 목록 한 줄 — 사진 한 덩이에 글 두 줄, 오른쪽 끝에 고르는 칸 */
function Item({ open }: { open?: boolean }) {
  return (
    <div className="wf-li">
      <span className="wf-shot" />
      <div className="wf-li-text">
        <L w={72} tall />
        <L w={40} />
        <L w={88} />
        {open && (
          <div className="wf-story">
            <L w={100} />
            <L w={100} />
            <L w={64} />
          </div>
        )}
      </div>
      <span className="wf-check" />
    </div>
  );
}

/** 머리 — 가운데 이름, 왼쪽에 되돌아가기 */
function Head({ back }: { back?: boolean }) {
  return (
    <div className="wf-head">
      {back && <span className="wf-back" />}
      <L w={38} tall />
    </div>
  );
}

export type WireKind = "gift" | "product" | "scent1" | "scent2";

export function TamburinsWire({ kind }: { kind: WireKind }) {
  return (
    <div className="wf" data-kind={kind}>
      {kind === "gift" && (
        <>
          <Head />
          <span className="wf-hero" />
          <div className="wf-pad">
            <L w={100} />
            <L w={94} />
            <L w={52} />
            <div className="wf-gap" />
            <L w={34} tall />
          </div>
          <div className="wf-row">
            {[0, 1, 2, 3].map((i) => (
              <div className="wf-card" key={i}>
                <span className="wf-card-shot" />
                <L w={86} />
                <L w={58} />
              </div>
            ))}
          </div>
        </>
      )}

      {kind === "product" && (
        <>
          <Head />
          <span className="wf-hero" data-tall />
          <div className="wf-pad">
            <L w={68} tall />
            <L w={34} />
            <div className="wf-thumbs">
              <span className="wf-thumb" />
              <span className="wf-thumb" />
            </div>
            <div className="wf-rule" />
            <L w={46} />
            <div className="wf-opt">
              <span className="wf-opt-shot" />
              <div className="wf-li-text">
                <L w={78} />
                <L w={54} />
              </div>
            </div>
            <span className="wf-btn" />
          </div>
        </>
      )}

      {kind === "scent1" && (
        <>
          <Head back />
          <div className="wf-pad">
            <Item />
            <Item />
            <Item />
            <Item />
          </div>
          <div className="wf-foot">
            <span className="wf-btn" />
          </div>
        </>
      )}

      {kind === "scent2" && (
        <>
          <Head back />
          <div className="wf-pad">
            <Item open />
            <Item />
            <Item />
          </div>
          <div className="wf-foot">
            <span className="wf-btn" data-ghost />
            <span className="wf-btn" />
          </div>
        </>
      )}
    </div>
  );
}
