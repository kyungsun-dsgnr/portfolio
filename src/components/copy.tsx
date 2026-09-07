"use client";

/**
 * 문구 갈아 끼우기
 *
 * `/` 와 `/before` 가 같은 장들을 그대로 쓰면서 글만 다르게 세웁니다.
 * 장마다 복제본을 만들지 않으려고, 손보기 전의 글을 열쇠로 삼아 바꿀 것만 바꿉니다.
 *
 * 쓰는 쪽 — `const { c, polished } = useCopy();` 뒤에 `{c("손보기 전 글")}`.
 * 지도가 없으면(`/before`) 장에 적힌 글이 그대로 나옵니다.
 *
 * `polished` 는 글이 아니라 새로 붙는 것(아픈 자리 라벨 같은)을 켜는 데 씁니다.
 */

import { createContext, useContext, type ReactNode } from "react";

export type CopyMap = Record<string, string>;

const Ctx = createContext<CopyMap | null>(null);

export function CopyProvider({
  value,
  children,
}: {
  value: CopyMap;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCopy() {
  const map = useContext(Ctx);
  return {
    c: (text: string) => map?.[text] ?? text,
    polished: map !== null,
  };
}
