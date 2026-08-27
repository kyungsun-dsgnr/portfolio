"use client";

/** 12장 — 탬버린즈 케이스 표지에 들어가는 선물 상자 */

import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * 좌측 이미지의 겹 하나. 자리와 크기는 디자인 px 이고, --u 를 곱해 화면 크기에 맞춥니다.
 * 배열 순서가 그대로 앞뒤 순서라, 뒤에 오는 겹이 앞을 덮습니다.
 */
type Layer = {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

/* 상자와 상자 앞면은 같은 사진에서 잘라 낸 것이라 자리가 어긋나면 바로 티가 납니다.
   앞면은 상자 원본의 1022번째 줄부터 잘려 나왔고, 619 폭으로 놓으면 511 아래입니다.
   뚜껑은 그 사진의 826번째 줄에서 잘라 따로 두었습니다. 그 줄이 뚜껑이 접히는
   뒤쪽 모서리라, 두 겹을 제자리에 놓으면 원래 사진과 똑같이 맞물립니다. */
const LID: Layer = {
  src: "/images/tamburins-box-lid.png",
  left: 32,
  top: 0,
  width: 618.91,
  height: 412.94,
};

const BOX: Layer = {
  src: "/images/tamburins-box-base.png",
  left: 32,
  top: 412.94,
  width: 618.91,
  height: 327.06,
};

const FRONT: Layer = {
  src: "/images/tamburins-box-front.png",
  left: 32,
  top: 511,
  width: 618.91,
  height: 229,
};

/* 상자에 담기는 것들. 밑동이 상자 앞면에 가려지도록 앞면보다 뒤에 놓입니다.
   기울기와 시차를 서로 다르게 두어 둘이 한 몸처럼 떨어지지 않게 합니다.
   fall 은 판 위쪽 밖에서 시작하도록 제 자리보다 조금 더 잡은 값입니다. */
export const GOODS: (Layer & {
  id: string;
  tilt: string;
  delay: string;
  fall: number;
})[] = [
  {
    id: "perfume",
    src: "/images/tamburins-perfume.png",
    left: 126.38,
    top: 386.74,
    width: 213.06,
    height: 214.43,
    tilt: "-11deg",
    delay: "1.5s",
    fall: 620,
  },
  {
    id: "wash",
    src: "/images/tamburins-handwash.png",
    left: 362.33,
    top: 98.16,
    width: 164.61,
    height: 480.06,
    tilt: "5.5deg",
    delay: "1.74s",
    fall: 600,
  },
];

/* 상자가 판에 놓이며 지는 그림자. 빛이 왼쪽 위 창에서 드니 오른쪽으로 눕습니다.
   윗동은 상자에 가려지고, 밑단(740) 아래로 드러나는 부분만 보입니다. */
const CAST = { left: 46, top: 562.5, width: 607.3, height: 90.3 };

/** 제품이 상자 안 바닥에 닿으며 지는 그림자. 밑동 자리에 깔립니다. */
const shadeOf = (one: (typeof GOODS)[number]) => ({
  /* 빛이 왼쪽 위에서 드니 그림자는 오른쪽으로 조금 밀립니다. */
  left: one.left - one.width * 0.06 + 16,
  top: one.top + one.height - 17,
  width: one.width * 1.12,
  height: 34,
});

/** 디자인 px 을 화면 크기로 옮깁니다. */
/** 그림이 차지하는 원래 칸. 배율을 줄이면 이 칸을 기준으로 가운데에 다시 앉힙니다. */
const ART = { left: 32, width: 618.91, height: 740 };

/* 남는 세로 여백을 위아래로 어떻게 나눌지. 위로 조금 더 보내 상자를 내려 앉히되,
   앞쪽에 바닥과 그림자가 놓일 자리는 남겨 둡니다. 다 내려 버리면 그림자가 설 곳이 없어
   도리어 떠 보입니다. */
const GROUND_BIAS = 0.84;

/** 도면 좌표를 배율에 맞춰 화면 크기로 옮깁니다. */
const at = (
  box: { left: number; top: number; width: number; height: number },
  scale: number,
) => {
  const shiftX = (682 - ART.width * scale) / 2;
  const shiftY = (740 - ART.height * scale) * GROUND_BIAS;
  return {
    left: `calc(${(shiftX + (box.left - ART.left) * scale).toFixed(2)} * var(--u))`,
    top: `calc(${(shiftY + box.top * scale).toFixed(2)} * var(--u))`,
    width: `calc(${(box.width * scale).toFixed(2)} * var(--u))`,
    height: `calc(${(box.height * scale).toFixed(2)} * var(--u))`,
  } as CSSProperties;
};

/**
 * 선물 상자에 제품이 담긴 모습. 케이스 표지의 비주얼 자리에 그대로 들어갑니다.
 * 자리 값은 682×740 칸을 기준으로 잡혀 있어, 그 크기의 칸이면 어디에 놓아도 맞습니다.
 */
/**
 * scale 은 그림 전체를 줄이는 배율입니다. 1 이면 칸을 가득 채웁니다.
 * placed 를 주면 그 안에 든 것만 상자에 담깁니다. 주지 않으면 처음부터 다 담깁니다.
 */
export function TamburinsBox({
  scale = 1,
  placed,
  from = "left",
}: {
  scale?: number;
  placed?: string[];
  /** 제품이 어느 쪽에서 들려 오는지. 고르는 카드가 놓인 쪽입니다. */
  from?: "left" | "right";
}) {
  /* 손으로 담는 장에서는 누른 그 순간에 떨어져야 합니다.
     처음부터 담아 두는 장에서만 상자가 열리기를 기다립니다. */
  const goods = placed ? GOODS.filter((one) => placed.includes(one.id)) : GOODS;
  /* 벽과 바닥이 갈리는 선. 상자를 살짝 위에서 본 사진이라 이 선은 상자 뒤에 있고,
     따라서 밑단(740)이 아니라 그보다 위(505)에 놓여야 상자가 바닥에 놓인 것으로 읽힙니다.
     선의 대부분은 상자에 가려지고, 좌우로만 드러납니다. */
  const ground = (740 - ART.height * scale) * GROUND_BIAS + 505 * scale;

  return (
    <div
      className="tam-box relative h-full w-full overflow-hidden"
      style={{ "--ground": ground.toFixed(1) } as CSSProperties}
    >
      {/* 벽과 바닥, 그리고 창에서 든 볕. 모두 상자보다 뒤에 깔립니다. */}
      <div className="tam-floor" aria-hidden />
      <div className="tam-sun" aria-hidden />
      <div className="tam-sun-floor" aria-hidden />
      <div className="tam-cast absolute" style={at(CAST, scale)} aria-hidden />

      <div className="absolute" style={at(BOX, scale)}>
        <Image
          alt=""
          src={BOX.src}
          fill
          sizes="50vw"
          priority
          className="object-contain"
        />
      </div>

      {/* 뚜껑. 닫힌 채로 있다가 뒤쪽 모서리를 축으로 열립니다.
          제품보다 앞에 두면 열린 뒤에도 제품을 가려서, 여기 한 겹으로 둡니다. */}
      <div className="tam-lid absolute" style={at(LID, scale)}>
        <Image
          alt=""
          src={LID.src}
          fill
          sizes="50vw"
          priority
          className="object-contain"
        />
      </div>

      {/* 위에서 떨어져 상자에 담기고, 닿은 자리에서 반듯하게 섭니다. */}
      {/* 담긴 것마다 안쪽 바닥 그림자가 하나씩 늘어납니다.
          제품이 내려앉는 데 맞춰 조금 늦게 짙어집니다. */}
      {goods.map((one) => (
        <div
          key={`${one.id}-shade`}
          className="tam-shade absolute"
          style={
            {
              ...at(shadeOf(one), scale),
              "--delay": placed ? "0.05s" : one.delay,
            } as CSSProperties
          }
          aria-hidden
        />
      ))}

      {goods.map((one) => (
        <div
          key={one.src}
          className="tam-drop absolute"
          style={
            {
              ...at(one, scale),
              "--tilt": one.tilt,
              "--delay": placed ? "0.05s" : one.delay,
              "--fall": (one.fall * scale).toFixed(1),
              "--from-x": ((from === "left" ? -170 : 170) * scale).toFixed(1),
            } as CSSProperties
          }
        >
          <div className="tam-bob">
            <Image
              alt=""
              src={one.src}
              fill
              sizes="50vw"
              className="object-contain"
            />
          </div>
        </div>
      ))}

      {/* 상자 앞면이 맨 앞에 서서 제품 밑동을 가립니다. */}
      <div className="absolute" style={at(FRONT, scale)}>
        <Image
          alt=""
          src={FRONT.src}
          fill
          sizes="50vw"
          className="object-contain"
        />
      </div>

      {/* 볕은 벽만이 아니라 상자와 제품 위로도 지나갑니다.
          같은 자리에 아주 옅게 한 겹 더 얹어 빛이 지나간 자국을 남깁니다. */}
      <div className="tam-sun tam-sun-over" aria-hidden />
    </div>
  );
}
