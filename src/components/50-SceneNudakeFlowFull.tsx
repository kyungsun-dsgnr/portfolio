"use client";

/**
 * 누데이크 05 — 한 흐름, 네 장면 (한 화면 판)
 *
 * `One Flow, Four Moments` 를 `One screen, one gift.`(21장) 의 판에 다시 올립니다 —
 * 제목 1–3단 1행 · QR 1–2단 2행 · 화면 하나가 한가운데 온 키로 서고,
 * 네 걸음의 글이 그 좌우에 갈라 섭니다(왼쪽 3–4 · 5–6행, 오른쪽 2–3 · 5–6행).
 * 장은 21장처럼 어둡습니다.
 *
 * 화면은 장에 들어서면 고르기부터 보내기까지 스스로 돕니다.
 * 글을 누르면 그 걸음의 화면이 서고, 나머지 글은 물러납니다.
 */

import { useEffect, useState, type CSSProperties } from "react";
import QRCode from "qrcode";

import { NudakeMockCompose } from "@/components/NudakeComposeScreen";
import { useInView } from "@/components/useInView";

/* 네 걸음. `step` 은 개선 화면이 서 있을 자리입니다. */
const MOMENTS = [
  {
    index: "01",
    title: "Choose Tea",
    body: "티 기프트 상품을 선택하는 화면",
    place: "col-start-1 col-span-2 row-start-3 row-span-2",
    step: "list" as const,
  },
  {
    index: "02",
    title: "Product Detail",
    body: "선택한 티 기프트의 정보와 ‘선물하기’ CTA를 확인하는 화면",
    place: "col-start-1 col-span-2 row-start-5 row-span-2",
    step: "detail" as const,
  },
  {
    index: "03",
    title: "Write Message",
    body: "선물 카드에 메시지를 작성하는 화면",
    place: "col-start-7 col-span-2 row-start-2 row-span-2",
    step: "note" as const,
  },
  {
    index: "04",
    title: "Send Gift",
    body: "받는 사람 정보와 결제 과정을 거쳐 선물을 보내는 화면",
    place: "col-start-7 col-span-2 row-start-5 row-span-2",
    step: "pay" as const,
  },
];

/** 화면의 키 — 판의 전 행(740)입니다. */
const FRAME_H = 740;

/** 휴대폰에서 열리는 자리. 저장소 하위에 배포되는 경우까지 함께 셈합니다. */
const PHONE_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/m/nudake`;

export function SceneNudakeFlowFull() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  /* 손에 쥔 기기에서 이 화면을 직접 굴려 보는 자리 */
  const [mark, setMark] = useState<string | null>(null);

  /* 골라 세운 걸음. 없으면 화면이 스스로 돕니다. */
  const [focus, setFocus] = useState<number | null>(null);

  useEffect(() => {
    const to = `${window.location.origin}${PHONE_PATH}`;
    QRCode.toString(to, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: "#fafafa", light: "#00000000" },
    })
      .then(setMark)
      .catch(() => setMark(null));
  }, []);

  /* 장을 벗어나면 고른 것도 풉니다 — 돌아오면 처음부터 다시 돕니다. */
  useEffect(() => {
    if (inView) return;
    const back = window.setTimeout(() => setFocus(null), 0);
    return () => clearTimeout(back);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="page-grid compose-full"
      data-visible={inView || undefined}
    >
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        One Flow,
        <br />
        Four Moments
      </h2>

      {/* 판 위 목업은 결국 그림입니다. QR 로 제 손의 기기에서 굴려 보게 합니다. */}
      <div
        className="qr-card rise col-start-1 col-span-2 row-start-2"
        style={{ "--delay": "0.24s" } as CSSProperties}
      >
        <p className="qr-eyebrow">Try it on your phone</p>

        {mark && (
          <div
            className="qr-mark"
            aria-hidden
            dangerouslySetInnerHTML={{ __html: mark }}
          />
        )}
      </div>

      {/* 네 걸음. 화면 좌우로 갈라 세웁니다. 누르면 그 걸음의 화면이 섭니다. */}
      {MOMENTS.map((one, i) => (
        <button
          type="button"
          key={one.index}
          className={`issue rise ${one.place}`}
          data-dim={focus !== null && focus !== i ? true : undefined}
          aria-pressed={focus === i}
          onClick={() => setFocus((now) => (now === i ? null : i))}
          style={{ "--delay": `${0.3 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{one.index}</span>
          <h3 className="type-title">{one.title}</h3>
          <p className="type-body">{one.body}</p>
        </button>
      ))}

      {/* 화면 하나가 한가운데 온 키로 섭니다. 고른 걸음이 없으면 스스로 돕니다. */}
      <div className="compose-full-frame">
        {focus === null ? (
          <NudakeMockCompose key="run" run={inView} height={FRAME_H} />
        ) : (
          <NudakeMockCompose
            key={MOMENTS[focus].step}
            step={MOMENTS[focus].step}
            height={FRAME_H}
          />
        )}
      </div>
    </div>
  );
}
