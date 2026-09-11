"use client";

/**
 * 누데이크 05 — Made Here, Given Anywhere.
 *
 * 매장 둘에서 시작한 누데이크의 경험이 온라인 선물로 넓어지는 장입니다.
 * 판은 `One screen, one gift.`(21장) 과 같습니다 —
 * 제목 1–3단 1행 · QR 1–2단 2행 · 다 쓴 엽서가 담긴 화면 하나가 한가운데
 * 온 키로 서고, 세 마디가 그 좌우에 갈라 섭니다(왼쪽 5–6행 · 오른쪽 2–3 · 5–6행).
 * 장은 21장처럼 어둡습니다.
 *
 * 세 마디는 탬버린즈 장의 셋과 짝을 이룹니다 —
 * 사기 전에 구성을 보듯, 보내기 전에 선물을 만듭니다.
 */

import { useEffect, useState, type CSSProperties } from "react";
import QRCode from "qrcode";

import { NudakeMockCompose } from "@/components/NudakeComposeScreen";
import { useInView } from "@/components/useInView";

const POINTS = [
  {
    index: "01",
    title: "Composed Before Sending",
    body: "선물을 고르는 데서 끝나지 않습니다.\nTea를 선택하고 엽서에 담으며, 보내기 전 선물의 모습을 직접 완성합니다.",
    place: "col-start-1 col-span-2 row-start-5 row-span-2",
  },
  {
    index: "02",
    title: "A Message Becomes Part of the Gift",
    body: "메시지는 결제 이후 덧붙이는 정보가 아니라,\n엽서 위에 직접 작성하며 선물의 일부로 완성됩니다.",
    place: "col-start-7 col-span-2 row-start-2 row-span-2",
  },
  {
    index: "03",
    title: "Given Without Leaving NUDAKE",
    body: "발견 이후 외부 서비스로 이동하던 경험을 브랜드 안에서 이어갑니다.\n고르고, 만들고, 전달하는 순간까지 NUDAKE의 경험으로 연결합니다.",
    place: "col-start-7 col-span-2 row-start-5 row-span-2",
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

  return (
    <div
      ref={ref}
      className="page-grid compose-full"
      data-visible={inView || undefined}
    >
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Made Here,
        <br />
        Given Anywhere.
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

      {/* 세 마디. 화면 좌우로 갈라 세웁니다. */}
      {POINTS.map((one, i) => (
        <div
          key={one.index}
          className={`issue rise ${one.place}`}
          style={{ "--delay": `${0.3 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{one.index}</span>
          <h3 className="type-title">{one.title}</h3>
          <p className="type-body">{one.body}</p>
        </div>
      ))}

      {/* 다 쓴 엽서가 티 기프트와 함께 담긴 화면. 한가운데 온 키로 섭니다. */}
      <div className="compose-full-frame">
        <NudakeMockCompose step="note" written height={FRAME_H} />
      </div>
    </div>
  );
}
