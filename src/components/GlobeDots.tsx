"use client";

import {
  geoContains,
  geoDistance,
  geoEquirectangular,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { useEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";

import { STORES } from "@/data/gentle-monster-stores";

/** 손을 뗀 뒤 남는 회전 */
const FRICTION = 0.94;
/** 가만히 두면 이 속도로 천천히 돕니다(도/프레임) */
const IDLE_SPIN = 0.06;
/** 받침대에 꽂힌 지구본처럼 축을 고정합니다. 세로로는 돌지 않아 극이 정면에 오지 않습니다. */
const TILT = -6;
/** 매장을 집을 수 있는 반경(px) */
const HIT_RADIUS = 14;
/** 점 격자의 위도 간격(도). 작을수록 촘촘합니다. */
const LAT_STEP = 1.5;

/** 지구본에 찍히는 점 하나. home 은 매장이 있는 나라인지. */
type Dot = { at: [number, number]; home: boolean };

const RASTER_W = 720;
const RASTER_H = 360;

/** 도형을 등장방형으로 한 번 그려 놓고, 픽셀이 칠해졌는지로 포함 여부를 봅니다.
 *  폴리곤 포함 검사를 수만 번 하는 것보다 훨씬 빠릅니다. */
function rasterize(shape: FeatureCollection): Uint8ClampedArray | null {
  const off = document.createElement("canvas");
  off.width = RASTER_W;
  off.height = RASTER_H;
  const ctx = off.getContext("2d");
  if (!ctx) return null;

  const projection = geoEquirectangular()
    .scale(RASTER_W / (2 * Math.PI))
    .translate([RASTER_W / 2, RASTER_H / 2]);

  ctx.beginPath();
  geoPath(projection, ctx)(shape);
  ctx.fillStyle = "#000";
  ctx.fill();

  return ctx.getImageData(0, 0, RASTER_W, RASTER_H).data;
}

function landDots(land: FeatureCollection, homelands: FeatureCollection): Dot[] {
  const landPixels = rasterize(land);
  const homePixels = rasterize(homelands);
  if (!landPixels || !homePixels) return [];

  const dots: Dot[] = [];

  for (let lat = -84; lat <= 84; lat += LAT_STEP) {
    // 위도가 높을수록 경도 간격을 넓혀 점 밀도를 고르게 만듭니다.
    const lonStep = LAT_STEP / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += lonStep) {
      const x = Math.floor(((lon + 180) / 360) * RASTER_W);
      const y = Math.floor(((90 - lat) / 180) * RASTER_H);
      const i = (y * RASTER_W + x) * 4 + 3;
      if (landPixels[i] <= 128) continue;
      dots.push({ at: [lon, lat], home: homePixels[i] > 128 });
    }
  }

  return dots;
}

export function GlobeDots() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dots, setDots] = useState<Dot[] | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const rotation = useRef<[number, number]>([-10, TILT]);
  const velocity = useRef<[number, number]>([IDLE_SPIN, 0]);
  const dragging = useRef(false);
  const last = useRef<[number, number]>([0, 0]);
  const activeRef = useRef<number | null>(null);
  const screen = useRef<{ i: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let alive = true;
    import("world-atlas/countries-110m.json").then((mod) => {
      if (!alive) return;
      const topo = (mod.default ?? mod) as unknown as Topology<{
        land: GeometryCollection;
        countries: GeometryCollection;
      }>;
      const land = feature(topo, topo.objects.land) as unknown as FeatureCollection;
      const countries = feature(topo, topo.objects.countries) as unknown as FeatureCollection;

      // 매장 좌표를 품고 있는 나라만 골라 냅니다.
      const homelands: FeatureCollection = {
        type: "FeatureCollection",
        features: countries.features.filter((country) =>
          STORES.some((store) => geoContains(country, store.at)),
        ),
      };

      setDots(landDots(land, homelands));
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
        const vx = velocity.current[0] * FRICTION + IDLE_SPIN * (1 - FRICTION);
        velocity.current = [vx, 0];
        rotation.current = [rotation.current[0] + vx, TILT];
      }

      projection.rotate(rotation.current);
      ctx!.clearRect(0, 0, width, height);

      const center: [number, number] = [-rotation.current[0], -rotation.current[1]];
      /* 가장자리로 갈수록 옅어지게 세 겹으로 나누고, 매장 보유국은 따로 모읍니다.
         한 겹마다 fill 한 번이라 점이 수천 개여도 부담이 적습니다. */
      const plain: [number, number][][] = [[], [], []];
      const home: [number, number][][] = [[], [], []];

      for (const dot of dots!) {
        const d = geoDistance(dot.at, center);
        if (d > Math.PI / 2) continue;
        const point = projection(dot.at);
        if (!point) continue;
        // 0(정면) ~ 1(가장자리)
        const edge = d / (Math.PI / 2);
        const band = edge < 0.55 ? 0 : edge < 0.82 ? 1 : 2;
        (dot.home ? home : plain)[band].push(point);
      }

      function paint(
        bands: [number, number][][],
        size: number,
        rgb: string,
        alpha: number[],
      ) {
        bands.forEach((band, i) => {
          if (!band.length) return;
          ctx!.beginPath();
          for (const [x, y] of band) ctx!.rect(x - size / 2, y - size / 2, size, size);
          ctx!.fillStyle = `rgba(${rgb}, ${alpha[i]})`;
          ctx!.fill();
        });
      }

      // 매장이 없는 나라는 바탕처럼 옅게, 있는 나라는 또렷하게.
      paint(plain, 2.7 * unit, "125, 125, 125", [0.5, 0.36, 0.2]);
      paint(home, 3.2 * unit, "60, 60, 60", [0.95, 0.7, 0.42]);

      // 매장
      const visible: { i: number; x: number; y: number }[] = [];
      STORES.forEach((store, i) => {
        if (geoDistance(store.at, center) > Math.PI / 2) return;
        const point = projection(store.at);
        if (!point) return;

        const [x, y] = point;
        visible.push({ i, x, y });

        const isActive = activeRef.current === i;
        const r = (store.flagship ? 6 : 4.6) * unit * (isActive ? 1.45 : 1);

        // 배경색 링을 먼저 깔아 회색 점밭에서 도시를 떼어 놓습니다.
        ctx!.beginPath();
        ctx!.arc(x, y, r * 1.75, 0, Math.PI * 2);
        ctx!.fillStyle = "#fafafa";
        ctx!.fill();

        if (isActive) {
          ctx!.beginPath();
          ctx!.arc(x, y, r * 2.5, 0, Math.PI * 2);
          ctx!.strokeStyle = "rgba(25, 25, 25, 0.5)";
          ctx!.lineWidth = unit * 1.2;
          ctx!.stroke();
        }

        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fillStyle = "#191919";
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

    if (dragging.current) {
      // 가로로만 돕니다. 세로 움직임은 회전에 쓰지 않습니다.
      const dx = event.clientX - last.current[0];
      last.current = [event.clientX, event.clientY];
      const speed = 220 / Math.min(box.width, box.height);
      velocity.current = [dx * speed, 0];
      rotation.current = [rotation.current[0] + dx * speed, TILT];
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
    <div ref={wrapRef} className="globe">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={(event) => {
          dragging.current = false;
          try {
            event.currentTarget.releasePointerCapture(event.pointerId);
          } catch {
            // 캡처가 없었으면 놓을 것도 없습니다.
          }
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
