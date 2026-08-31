"use client";

/** 15장 넷째 칸 — 다 고른 제품 화면에서 담기를 눌러 장바구니로 갑니다. */

import { useEffect, useState } from "react";

import { TamburinsCartScreen } from "@/components/TamburinsCartScreen";
import { TamburinsProductScreen } from "@/components/TamburinsProductScreen";
import { useInView } from "@/components/useInView";

/* 장에 들어서면 스스로 누르고 넘어갑니다. */
const PRESS_AT = 1500;
const CART_AT = 2300;

export function TamburinsBagScreen({
  run = true,
}: {
  /** 차례가 되면 스스로 누릅니다. */
  run?: boolean;
} = {}) {
  const [page] = useInView<HTMLDivElement>(0.3);
  const [press, setPress] = useState(false);
  const [cart, setCart] = useState(false);

  useEffect(() => {
    /* 차례가 아니면 그대로 둡니다. */
    if (!run) return;

    const timers = [
      window.setTimeout(() => setPress(true), PRESS_AT),
      window.setTimeout(() => setCart(true), CART_AT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [run]);

  return (
    <div className="bag-screen" ref={page}>
      <div className="bag-under" data-hide={cart || undefined}>
        <TamburinsProductScreen chosen still addPress={press} />
      </div>

      {/* 담으면 장바구니가 아래에서 올라옵니다. */}
      <div className="bag-over" data-in={cart || undefined}>
        <TamburinsCartScreen />
      </div>
    </div>
  );
}
