"use client";

import { geoDistance, geoEquirectangular, geoOrthographic, geoPath } from "d3-geo";
import { useEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";

import { STORES } from "@/data/gentle-monster-stores";

/** 손을 뗀 뒤 남는 회전 */
const FRICTION = 0.94;
/** 가만히 두면 이 속도로 천천히 돕니다(도/프레임) */
const IDLE_SPIN = 0.06;
/** 세로 회전은 극을 넘지 않게 묶습니다 */
const MAX_TILT = 70;
/** 매장을 집을 수 있는 반경(px) */
const HIT_RADIUS = 14;
/** 점 격자의 위도 간격(도). 작을수록 촘촘합니다. */
const LAT_STEP = 2.2;

/**
 * 육지를 점으로 찍기 위한 좌표를 미리 만듭니다.
 * 폴리곤 포함 검사를 수만 번 하면 느리므로, 등장방형으로 한 번 그려 놓고
 * 픽셀이 칠해졌는지로 판정합니다.
 */
function landDots(land: FeatureCollection): [number, number][] {
  const W = 720;
  const H = 360;
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const ctx = off.getContext("2d");
  if (!ctx) return [];

  const projection = geoEquirectangular()
    .scale(W / (2 * Math.PI))
    .translate([W / 2, H / 2]);
  const path = geoPath(projection, ctx);

  ctx.beginPath();
  path(land);
  ctx.fillStyle = "#000";
  ctx.fill();

  const pixels = ctx.getImageData(0, 0, W, H).data;
  const dots: [number, number][] = [];

  for (let lat = -84; lat <= 84; lat += LAT_STEP) {
    // 위도가 높을수록 경도 간격을 넓혀 점 밀도를 고르게 만듭니다.
    const lonStep = LAT_STEP / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += lonStep) {
      const x = Math.floor(((lon + 180) / 360) * W);
      const y = Math.floor(((90 - lat) / 180) * H);
      if (pixels[(y * W + x) * 4 + 3] > 128) dots.push([lon, lat]);
    }
  }

  return dots;
}

export function GlobeDots() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dots, setDots] = useState<[number, number][] | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const rotation = useRef<[number, number]>([-10, -18]);
  const velocity = useRef<[number, number]>([IDLE_SPIN, 0]);
  const dragging = useRef(false);
  const last = useRef<[number, number]>([0, 0]);
  const activeRef = useRef<number | null>(null);
  const screen = useRef<{ i: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let alive = true;
    import("world-atlas/countries-110m.json").then((mod) => {
      if (!alive) return;
      const topo = (mod.default ?? mod) as unknown as Topology<{ land: GeometryCollection }>;
      const land = feature(topo, topo.objects.land) as unknown as FeatureCollection;
      setDots(landDots(land));
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !dots) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const projection = geoOrthographic();
    let width = 0;
    let height = 0;
    let unit = 1;

    function resize() {
      const box = wrap!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = box.width;
      height = box.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const radius = (Math.min(width, height) / 2) * 0.92;
      projection.translate([width / 2, height / 2]).scale(radius);
      unit = radius / 320;
    }

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    let frame = 0;

    function draw() {
      if (!dragging.current) {
        let [vx, vy] = velocity.current;
        vx = vx * FRICTION + IDLE_SPIN * (1 - FRICTION);
        vy *= FRICTION;
        velocity.current = [vx, vy];
        rotation.current = [
          rotation.current[0] + vx,
          Math.max(-MAX_TILT, Math.min(MAX_TILT, rotation.current[1] + vy)),
        ];
      }

      projection.rotate(rotation.current);
      ctx!.clearRect(0, 0, width, height);

      const center: [number, number] = [-rotation.current[0], -rotation.current[1]];
      const size = 1.7 * unit;

      /* 가장자리로 갈수록 옅어지게 세 겹으로 나눠 칠합니다.
         한 겹마다 fill 한 번이라 점이 수천 개여도 부담이 적습니다. */
      const bands: [number, number][][] = [[], [], []];

      for (const dot of dots!) {
        const d = geoDistance(dot, center);
        if (d > Math.PI / 2) continue;
        const point = projection(dot);
        if (!point) continue;
        // 0(정면) ~ 1(가장자리)
        const edge = d / (Math.PI / 2);
        bands[edge < 0.55 ? 0 : edge < 0.82 ? 1 : 2].push(point);
      }

      const alpha = [0.55, 0.34, 0.16];
      bands.forEach((band, i) => {
        if (!band.length) return;
        ctx!.beginPath();
        for (const [x, y] of band) ctx!.rect(x - size / 2, y - size / 2, size, size);
        ctx!.fillStyle = `rgba(120, 120, 120, ${alpha[i]})`;
        ctx!.fill();
      });

      // 매장
      const visible: { i: number; x: number; y: number }[] = [];
      STORES.forEach((store, i) => {
        if (geoDistance(store.at, center) > Math.PI / 2) return;
        const point = projection(store.at);
        if (!point) return;

        const [x, y] = point;
        visible.push({ i, x, y });

        const isActive = activeRef.current === i;
        const r = (store.flagship ? 3 : 2.2) * unit * (isActive ? 1.7 : 1);

        if (isActive) {
          ctx!.beginPath();
          ctx!.arc(x, y, r * 2.8, 0, Math.PI * 2);
          ctx!.strokeStyle = "rgba(90, 90, 90, 0.5)";
          ctx!.lineWidth = unit;
          ctx!.stroke();
        }

        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fillStyle = isActive ? "rgba(35, 35, 35, 1)" : "rgba(70, 70, 70, 0.9)";
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
  }, [dots]);

  function pointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    last.current = [event.clientX, event.clientY];
    velocity.current = [0, 0];
  }

  function pointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const box = event.currentTarget.getBoundingClientRect();

    if (dragging.current) {
      const dx = event.clientX - last.current[0];
      const dy = event.clientY - last.current[1];
      last.current = [event.clientX, event.clientY];
      const speed = 220 / Math.min(box.width, box.height);
      velocity.current = [dx * speed, -dy * speed];
      rotation.current = [
        rotation.current[0] + dx * speed,
        Math.max(-MAX_TILT, Math.min(MAX_TILT, rotation.current[1] - dy * speed)),
      ];
      return;
    }

    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
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

  const store = active === null ? null : STORES[active];

  return (
    <div ref={wrapRef} className="globe globe-grid">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          dragging.current = false;
        }}
        onPointerLeave={() => {
          dragging.current = false;
          activeRef.current = null;
          setActive(null);
        }}
      />

      <p className="globe-readout">
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
