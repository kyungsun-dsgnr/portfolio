"use client";

import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { useEffect, useRef, useState } from "react";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection, MultiLineString } from "geojson";

import { STORES } from "@/data/gentle-monster-stores";

/** 손을 뗀 뒤 남는 회전. 1 에 가까울수록 오래 돕니다. */
const FRICTION = 0.94;
/** 가만히 두면 이 속도로 천천히 돕니다(도/프레임). */
const IDLE_SPIN = 0.06;
/** 세로 회전은 극을 넘지 않게 묶어 둡니다. */
const MAX_TILT = 70;
/** 매장을 집을 수 있는 반경(px) */
const HIT_RADIUS = 14;

type Land = { land: FeatureCollection; borders: MultiLineString };

export function Globe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [land, setLand] = useState<Land | null>(null);
  const [active, setActive] = useState<number | null>(null);

  /* 회전 상태와 관성은 매 프레임 바뀌므로 ref 로만 둡니다. */
  const rotation = useRef<[number, number]>([-10, -20]);
  const velocity = useRef<[number, number]>([IDLE_SPIN, 0]);
  const dragging = useRef(false);
  const last = useRef<[number, number]>([0, 0]);
  const activeRef = useRef<number | null>(null);
  /** 화면에 보이는 매장의 화면 좌표. 마우스로 집을 때 씁니다. */
  const screen = useRef<{ i: number; x: number; y: number }[]>([]);

  // 지도 데이터는 한 번만 불러옵니다.
  useEffect(() => {
    let alive = true;
    import("world-atlas/countries-110m.json").then((mod) => {
      if (!alive) return;
      // world-atlas 는 land(대륙 덩어리)와 countries(국경) 둘을 담고 있습니다.
      const topo = (mod.default ?? mod) as unknown as Topology<{
        land: GeometryCollection;
        countries: GeometryCollection;
      }>;
      setLand({
        land: feature(topo, topo.objects.land) as unknown as FeatureCollection,
        borders: mesh(topo, topo.objects.countries, (a, b) => a !== b) as MultiLineString,
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !land) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const projection = geoOrthographic().precision(0.4);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();
    const sphere = { type: "Sphere" } as const;

    let width = 0;
    let height = 0;
    let unit = 1; // 디자인 1px 이 실제 몇 px 인지

    function resize() {
      const box = wrap!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = box.width;
      height = box.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 지구본은 짧은 쪽에 맞춰 넣고 가장자리에 여백을 둡니다.
      const radius = (Math.min(width, height) / 2) * 0.92;
      projection.translate([width / 2, height / 2]).scale(radius);
      unit = radius / 320;
    }

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    let frame = 0;

    function draw() {
      const [lambda, phi] = rotation.current;

      if (!dragging.current) {
        // 손을 떼면 관성으로 돌다가, 느려지면 천천히 도는 상태로 돌아옵니다.
        let [vx, vy] = velocity.current;
        vx = vx * FRICTION + IDLE_SPIN * (1 - FRICTION);
        vy *= FRICTION;
        velocity.current = [vx, vy];
        rotation.current = [lambda + vx, clampTilt(phi + vy)];
      }

      projection.rotate([rotation.current[0], rotation.current[1]]);
      ctx!.clearRect(0, 0, width, height);

      const ink = "25, 25, 25";

      // 경위선 — 지구본이라는 신호를 가장 약하게 깔아 둡니다.
      ctx!.beginPath();
      path(graticule);
      ctx!.lineWidth = unit;
      ctx!.strokeStyle = `rgba(${ink}, 0.12)`;
      ctx!.stroke();

      // 대륙 윤곽
      ctx!.beginPath();
      path(land!.land);
      ctx!.lineWidth = unit * 1.1;
      ctx!.strokeStyle = `rgba(${ink}, 0.55)`;
      ctx!.stroke();

      // 국경
      ctx!.beginPath();
      path(land!.borders);
      ctx!.lineWidth = unit;
      ctx!.strokeStyle = `rgba(${ink}, 0.18)`;
      ctx!.stroke();

      // 지구 테두리
      ctx!.beginPath();
      path(sphere);
      ctx!.lineWidth = unit;
      ctx!.strokeStyle = `rgba(${ink}, 0.35)`;
      ctx!.stroke();

      // 매장 — 뒤편으로 넘어간 것은 그리지 않습니다.
      const center: [number, number] = [-rotation.current[0], -rotation.current[1]];
      const visible: { i: number; x: number; y: number }[] = [];

      STORES.forEach((store, i) => {
        if (geoDistance(store.at, center) > Math.PI / 2) return;
        const point = projection(store.at);
        if (!point) return;

        const [x, y] = point;
        visible.push({ i, x, y });

        const isActive = activeRef.current === i;
        const r = (store.flagship ? 3.4 : 2.4) * unit * (isActive ? 1.8 : 1);

        if (isActive) {
          ctx!.beginPath();
          ctx!.arc(x, y, r * 2.6, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${ink}, 0.35)`;
          ctx!.lineWidth = unit;
          ctx!.stroke();
        }

        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${ink}, ${isActive ? 1 : 0.75})`;
        ctx!.fill();
      });

      screen.current = visible;
      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [land]);

  function clampTilt(phi: number) {
    return Math.max(-MAX_TILT, Math.min(MAX_TILT, phi));
  }

  function pointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    // 포인터 캡처가 실패해도 드래그 상태는 어긋나지 않게 먼저 세웁니다.
    dragging.current = true;
    last.current = [event.clientX, event.clientY];
    velocity.current = [0, 0];
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // 이미 놓친 포인터면 캡처할 것이 없습니다.
    }
  }

  function pointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;

    if (dragging.current) {
      const dx = event.clientX - last.current[0];
      const dy = event.clientY - last.current[1];
      last.current = [event.clientX, event.clientY];

      // 끌린 거리를 각도로. 지구본 크기와 무관하게 같은 손맛이 나도록 반지름으로 나눕니다.
      const speed = 220 / Math.min(box.width, box.height);
      velocity.current = [dx * speed, -dy * speed];
      rotation.current = [
        rotation.current[0] + dx * speed,
        clampTilt(rotation.current[1] - dy * speed),
      ];
      return;
    }

    // 끌지 않을 때는 가까운 매장을 집습니다.
    let found: number | null = null;
    let best = HIT_RADIUS;
    for (const point of screen.current) {
      const d = Math.hypot(point.x - x, point.y - y);
      if (d < best) {
        best = d;
        found = point.i;
      }
    }
    if (found !== activeRef.current) {
      activeRef.current = found;
      setActive(found);
    }
  }

  function pointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    dragging.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // 캡처가 없었으면 놓을 것도 없습니다.
    }
  }

  const store = active === null ? null : STORES[active];

  return (
    <div ref={wrapRef} className="globe">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerLeave={() => {
          dragging.current = false;
          activeRef.current = null;
          setActive(null);
        }}
      />

      <p className="globe-readout" data-on={store ? "" : undefined}>
        {store ? (
          <>
            <span className="globe-city">{store.city}</span>
            <span className="globe-name">{store.name}</span>
          </>
        ) : (
          <span className="globe-name">지구본을 돌려 도시를 찾아보세요</span>
        )}
      </p>
    </div>
  );
}
