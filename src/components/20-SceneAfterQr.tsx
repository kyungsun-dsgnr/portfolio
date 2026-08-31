"use client";

/**
 * 11장의 다른 판 — 휴대폰으로 직접 만져 보는 화면.
 *
 * 판 위 목업은 결국 그림입니다. 여기서는 QR 하나를 두어,
 * 보는 사람이 제 손의 기기에서 같은 화면을 직접 굴려 보게 합니다.
 * QR 이 가리키는 주소는 지금 이 판이 열려 있는 곳과 같은 host 라
 * 배포본에서도, 같은 망의 노트북에서도 그대로 통합니다.
 */

import { useEffect, useState, type CSSProperties } from "react";
import QRCode from "qrcode";

import { StoreGlobeMock } from "@/components/StoreGlobeMock";
import { useInView } from "@/components/useInView";

/** 휴대폰에서 열리는 자리. 저장소 하위에 배포되는 경우까지 함께 셈합니다. */
const PHONE_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/m/globe/`;

export function SceneAfterQr() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  /* QR 은 그리는 시점의 주소로 만듭니다. 배포처를 코드에 박아 두지 않습니다. */
  const [mark, setMark] = useState<string | null>(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    const to = `${window.location.origin}${PHONE_PATH}`;
    const show = window.setTimeout(() => setLink(to), 0);
    QRCode.toString(to, {
      type: "svg",
      margin: 0,
      errorCorrectionLevel: "M",
      color: { dark: "#fafafa", light: "#00000000" },
    })
      .then(setMark)
      .catch(() => setMark(null));

    return () => clearTimeout(show);
  }, []);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        Local Search,
        <br />
        Global Discovery
      </h2>

      <div
        className="after-frame rise col-start-4 col-span-2 row-start-1 row-span-6"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        <StoreGlobeMock initialWorld />
      </div>

      {/* 손에 쥔 기기에서 열어 보는 자리 */}
      <div
        className="qr-card rise col-start-6 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
        <p className="qr-eyebrow">Try it on your phone</p>

        {mark && (
          <div
            className="qr-mark"
            aria-hidden
            dangerouslySetInnerHTML={{ __html: mark }}
          />
        )}

        <p className="qr-note">
          카메라로 코드를 비추면 이 화면이 휴대폰에서 열립니다. 지구본을 직접
          돌리고 도시를 골라 보세요.
        </p>

        {link && (
          <a className="qr-link" href={PHONE_PATH}>
            {link.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>
    </div>
  );
}
