"use client";

/**
 * 목업 안 "현재 국가" 탭에 들어가는 실제 지도.
 *
 * 정적 내보내기라 키가 결과물에 그대로 실립니다. 그래서 키는 환경변수로 받고,
 * 없으면 지도를 부르지 않고 그리던 그림을 그대로 씁니다 —
 * 키가 없다고 화면이 비면 판 전체가 무너집니다.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

/** 스크립트는 판에 한 번만 붙습니다. 여러 목업이 같은 약속을 나눠 씁니다. */
let loading: Promise<void> | null = null;

function load() {
  if (loading) return loading;

  loading = new Promise<void>((done, fail) => {
    const tag = document.createElement("script");
    tag.src =
      `https://maps.googleapis.com/maps/api/js?key=${KEY}` +
      "&v=weekly&loading=async&callback=__mapReady";
    tag.async = true;
    tag.onerror = () => fail(new Error("지도를 불러오지 못했습니다"));

    (window as unknown as Record<string, unknown>).__mapReady = () => done();
    document.head.append(tag);
  });

  return loading;
}

type Props = {
  /** 지도의 한가운데. 기본은 서울 시청입니다. */
  at?: { lat: number; lng: number };
  zoom?: number;
};

export function GoogleMap({
  at = { lat: 37.5665, lng: 126.978 },
  zoom = 12,
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!KEY);

  useEffect(() => {
    if (!KEY) return;
    let alive = true;

    load()
      .then(() => {
        if (!alive || !box.current) return;
        const maps = (
          window as unknown as {
            google: { maps: { Map: new (...a: never[]) => unknown } };
          }
        ).google.maps;

        new (
          maps.Map as unknown as new (
            el: HTMLElement,
            options: Record<string, unknown>,
          ) => unknown
        )(box.current, {
          center: at,
          zoom,
          /* 목업 안 작은 화면이라 조작 장치는 다 걷어 냅니다. */
          disableDefaultUI: true,
          gestureHandling: "none",
          keyboardShortcuts: false,
        });
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
    };
  }, [at, zoom]);

  /* 키가 없거나 못 불렀을 때는 그리던 그림으로 물러납니다. */
  if (failed) {
    return (
      <Image
        src="/images/store-map.png"
        alt=""
        fill
        sizes="25vw"
        className="object-cover"
      />
    );
  }

  return <div ref={box} className="globe-map" />;
}
