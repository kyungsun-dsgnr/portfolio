"use client";

import {
  geoContains,
  geoDistance,
  geoEquirectangular,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";

import { STORES } from "@/data/gentle-monster-stores";

/** 손을 뗀 뒤 속도가 잦아드는 시간 상수(초). 클수록 오래 미끄러집니다. */
const GLIDE = 0.45;
/** 가만히 두면 이 속도로 천천히 돕니다(도/초) */
const IDLE_SPIN = 3.6;
/** 드래그가 만들어 낼 수 있는 최대 속도(도/초) */
const MAX_SPEED = 720;
/** 받침대에 꽂힌 지구본처럼 축을 고정합니다. 세로로는 돌지 않아 극이 정면에 오지 않습니다. */
const TILT = -6;
/** 매장을 집을 수 있는 반경(px) */
const HIT_RADIUS = 14;
/** 이름표를 띄우는 한계 각도. 90도가 지평선이라, 가장자리에 닿기 전에 접습니다. */
const TAG_LIMIT = Math.PI * 0.4;
/** 멈춘 지구본이 첫 도시를 가운데에서 서쪽으로 미는 각도(도) */
const STILL_TURN = 35;
/** 점 격자의 위도 간격(도). 작을수록 촘촘합니다. */
const LAT_STEP = 1.5;

/** 늘 이름표를 다는 도시. 대륙마다 하나씩 골라 이름표가 서로 겹치지 않게 둡니다. */
const TAGGED = [
  "Seoul",
  "Los Angeles",
  "Sydney",
  "Kuala Lumpur",
  "Milan",
  "Dubai",
];


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

function landDots(
  land: FeatureCollection,
  homelands: FeatureCollection,
): Dot[] {
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

type Props = {
  /** false 면 손대지 않고 계속 도는 장식이 됩니다. 뱃지와 매장 집기도 꺼집니다. */
  interactive?: boolean;
  /** 매장 보유국 이름표를 계속 띄워 둡니다. 지구본이 돌면 따라 돌고, 뒤로 넘어가면 숨습니다. */
  labels?: boolean;
  /** 이름표를 달 도시. 기본은 대륙마다 하나씩입니다. */
  tags?: string[];
  /** 매장 점을 집거나 빈 곳을 눌렀을 때 알려 줍니다. 끌어 돌린 것과는 구분합니다. */
  onPickStore?: (store: (typeof STORES)[number] | null) => void;
  /** 돌지 않고 멈춰 있는 지구본. 첫 도시가 정면에 옵니다. */
  still?: boolean;
};

export function GlobeDots({
  interactive = true,
  labels = false,
  tags,
  still = false,
  onPickStore,
}: Props) {
  const tagged = useMemo(
    () => (tags ?? TAGGED).map((city) => STORES.find((store) => store.city === city)!),
    [tags],
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dots, setDots] = useState<Dot[] | null>(null);
  /** 집어 둔 매장. 뱃지는 이때만 뜹니다. */
  const [chosen, setChosen] = useState<number | null>(null);
  const chosenRef = useRef<number | null>(null);

  /* 투영은 그리기 루프와 마우스 판정 양쪽에서 쓰므로 ref 로 둡니다. */
  const projectionRef = useRef(geoOrthographic());
  /** 매장 보유국 폴리곤과, 뱃지에 쓸 짧은 국가명 */
  const homelandsRef = useRef<
    { shape: FeatureCollection["features"][number]; label: string }[]
  >([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  /** 늘 떠 있는 나라 이름표들. 매 프레임 자리만 옮깁니다. */
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** 이름표 크기는 판넬 밖으로 나가는지 볼 때만 필요해 한 번 재고 아껴 씁니다. */
  const tagSize = useRef<([number, number] | undefined)[]>([]);
  /** 마우스가 지구본 위에 있으면 자동 회전을 멈춥니다. */
  const hovering = useRef(false);
  /** 위쪽에서 확대가 걸렸을 때의 배율. 좌표를 되돌리는 데 씁니다. */
  const zoom = useRef(1);
  /** 누른 뒤 끌린 거리. 짧으면 집은 것으로 봅니다. */
  const dragged = useRef(0);

  /* 멈춰 있을 때는 첫 도시를 가운데에서 왼쪽으로 밀어 두어
     오른쪽으로 펼쳐지는 이름표가 판넬 안에 들어옵니다. */
  const rotation = useRef<[number, number]>([
    still ? -tagged[0].at[0] - STILL_TURN : -10,
    TILT,
  ]);
  const velocity = useRef<[number, number]>([still ? 0 : IDLE_SPIN, 0]);
  /** 프레임/이벤트 간격을 재서 회전을 시간 기준으로 굴립니다. */
  const lastFrame = useRef(0);
  const lastMove = useRef(0);
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
      const land = feature(
        topo,
        topo.objects.land,
      ) as unknown as FeatureCollection;
      const countries = feature(
        topo,
        topo.objects.countries,
      ) as unknown as FeatureCollection;

      /* 매장 좌표를 품고 있는 나라만 골라 냅니다.
         이름은 지도 데이터의 정식 명칭("United States of America") 대신
         매장 데이터의 짧은 표기를 씁니다. */
      const picked = countries.features
        .map((shape) => ({
          shape,
          label: STORES.find((store) => geoContains(shape, store.at))?.country,
        }))
        .filter(
          (entry): entry is { shape: typeof entry.shape; label: string } =>
            Boolean(entry.label),
        );

      const homelands: FeatureCollection = {
        type: "FeatureCollection",
        features: picked.map((entry) => entry.shape),
      };

      homelandsRef.current = picked;
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

    const projection = projectionRef.current;
    // 구를 흰색으로 채울 때 씁니다. 반지름/중심을 따로 계산하지 않아도 됩니다.
    const path = geoPath(projection, ctx);
    const sphere = { type: "Sphere" } as const;
    let width = 0;
    let height = 0;
    let unit = 1;
    let radius = 0;

    function resize() {
      const box = wrap!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      /* 배치는 확대가 걸리기 전 좌표계로 잽니다. 이름표를 translate 로 옮기는데
         그 값은 위쪽 확대를 거치기 전 좌표라, 여기서 섞으면 자리가 어긋납니다. */
      width = wrap!.offsetWidth;
      height = wrap!.offsetHeight;
      // 대신 확대된 만큼 더 촘촘히 그려 흐려지지 않게 합니다.
      zoom.current = width ? box.width / width : 1;
      const ratio = dpr * zoom.current;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      radius = (Math.min(width, height) / 2) * 0.92;
      projection.translate([width / 2, height / 2]).scale(radius);
      /* 점 크기의 기준. 작은 자리에서는 1px 아래로 내려가 점이 사라지므로
         바닥을 둡니다. 큰 지구본에서는 이 바닥이 걸리지 않습니다. */
      unit = Math.max(0.5, radius / 320);
      tagSize.current = [];
    }

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    let frame = 0;

    function draw() {
      const now = performance.now();
      // 탭이 뒤에 있다 돌아왔을 때 한 번에 튀지 않게 상한을 둡니다.
      const dt = lastFrame.current
        ? Math.min(0.05, (now - lastFrame.current) / 1000)
        : 0;
      lastFrame.current = now;

      if (!dragging.current && dt) {
        // 마우스를 올리면 돌던 것이 잦아들고, 벗어나면 다시 천천히 돕니다.
        // 프레임 수가 아니라 흐른 시간으로 계산해 화면 주사율과 무관하게 같은 속도가 납니다.
        const idle =
          still || (interactive && hovering.current) ? 0 : IDLE_SPIN;
        const decay = Math.exp(-dt / GLIDE);
        const vx = velocity.current[0] * decay + idle * (1 - decay);
        velocity.current = [vx, 0];
        rotation.current = [rotation.current[0] + vx * dt, TILT];
      }

      projection.rotate(rotation.current);
      ctx!.clearRect(0, 0, width, height);

      /* 지구본 아래 그림자. 구를 칠하기 전에 그려 뒤로 보냅니다.
         납작한 타원이라 원형 그라디언트를 세로로 눌러서 씁니다. */
      const shade = radius * 0.58;
      ctx!.save();
      ctx!.translate(width / 2, height / 2 + radius * 1.05);
      ctx!.scale(1, 0.12);
      const glow = ctx!.createRadialGradient(0, 0, 0, 0, 0, shade);
      glow.addColorStop(0, "rgba(25, 25, 25, 0.005)");
      glow.addColorStop(0.5, "rgba(25, 25, 25, 0.002)");
      glow.addColorStop(1, "rgba(25, 25, 25, 0)");
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(0, 0, shade, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      // 페이지 바탕과 구분되도록 지구본 원 안쪽만 흰색으로 깝니다.
      ctx!.beginPath();
      path(sphere);
      ctx!.fillStyle = "#ffffff4a";
      ctx!.fill();

      const center: [number, number] = [
        -rotation.current[0],
        -rotation.current[1],
      ];
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
          for (const [x, y] of band)
            ctx!.rect(x - size / 2, y - size / 2, size, size);
          ctx!.fillStyle = `rgba(${rgb}, ${alpha[i]})`;
          ctx!.fill();
        });
      }

      /* 매장이 없는 나라는 바탕처럼 옅게, 있는 나라는 또렷하게.
         크기는 같고 색과 진하기로만 갈립니다. */
      const dot = 2 * unit;
      paint(plain, dot, "125, 125, 125", [0.5, 0.36, 0.2]);
      paint(home, dot, "60, 60, 60", [0.95, 0.7, 0.42]);

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

      /* 집어 둔 점 옆에 뱃지를 붙입니다. 오른쪽 자리가 모자라면 왼쪽으로 넘깁니다. */
      const badge = badgeRef.current;
      if (badge) {
        const at = visible.find((point) => point.i === chosenRef.current);
        if (at) {
          const w = badge.offsetWidth;
          const toLeft = at.x + HIT_RADIUS + w > width;
          badge.toggleAttribute("data-left", toLeft);
          const x = toLeft ? at.x - HIT_RADIUS - w : at.x + HIT_RADIUS;
          badge.style.translate = `${x}px calc(${at.y}px - 50%)`;
        }
        badge.toggleAttribute("data-on", Boolean(at));
      }

      /* 늘 떠 있는 나라 이름표. 앞면에 온 나라만 보이고 자리를 따라갑니다.
         캔버스가 아니라 DOM 이라 글꼴과 배경을 다른 뱃지와 같이 씁니다. */
      if (labels) {
        tagged.forEach((entry, i) => {
          const tag = tagRefs.current[i];
          if (!tag) return;
          const point =
            geoDistance(entry.at, center) > TAG_LIMIT
              ? null
              : projection(entry.at);
          if (!point) {
            tag.dataset.off = "";
            return;
          }

          // 호버 뱃지와 같은 자리 — 점 오른쪽으로 펼칩니다.
          const size = (tagSize.current[i] ??= [tag.offsetWidth, tag.offsetHeight]);
          const left = point[0] + HIT_RADIUS;
          const top = point[1] - size[1] / 2;
          // 한 귀퉁이라도 판넬을 벗어나면 그 자리에서 접습니다.
          if (left < 0 || top < 0 || left + size[0] > width || top + size[1] > height) {
            tag.dataset.off = "";
            return;
          }

          delete tag.dataset.off;
          tag.style.translate = `${left}px calc(${point[1]}px - 50%)`;
        });
      }

      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [dots, interactive, labels, still, tagged]);

  /** 화면 좌표에서 가장 가까운 매장 점을 찾아 둡니다.
      그리기와 같은 좌표계로 되돌립니다 — 확대가 걸려 있으면 그만큼 나눕니다. */
  function findStore(event: React.PointerEvent<HTMLCanvasElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / zoom.current;
    const y = (event.clientY - box.top) / zoom.current;

    let found: number | null = null;
    let best = HIT_RADIUS;
    for (const point of screen.current) {
      const d = Math.hypot(point.x - x, point.y - y);
      if (d < best) {
        best = d;
        found = point.i;
      }
    }
    activeRef.current = found;
  }

  function pointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    // 톡 누르기만 하면 move 가 오지 않으므로 여기서도 점을 찾아 둡니다.
    findStore(event);
    // 포인터 캡처가 실패해도 드래그 상태는 어긋나지 않게 먼저 세웁니다.
    dragging.current = true;
    hovering.current = true;
    dragged.current = 0;
    last.current = [event.clientX, event.clientY];
    lastMove.current = performance.now();
    velocity.current = [0, 0];
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // 이미 놓친 포인터면 캡처할 것이 없습니다.
    }
  }

  function pointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    // enter 에 기대지 않습니다. 움직임이 잡히면 이미 지구본 위입니다.
    hovering.current = true;
    const box = event.currentTarget.getBoundingClientRect();

    if (dragging.current) {
      // 가로로만 돕니다. 세로 움직임은 회전에 쓰지 않습니다.
      const dx = event.clientX - last.current[0];
      last.current = [event.clientX, event.clientY];

      const now = performance.now();
      const dt = Math.max(0.008, (now - (lastMove.current || now)) / 1000);
      lastMove.current = now;

      const turned = dx * (220 / Math.min(box.width, box.height));
      rotation.current = [rotation.current[0] + turned, TILT];
      // 놓았을 때 이어질 속도(도/초). 이벤트가 몰리면 과하게 잡히므로 묶어 둡니다.
      const speed = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, turned / dt));
      velocity.current = [speed, 0];
      dragged.current += Math.abs(dx);
      return;
    }

    findStore(event);
  }

  /* 뱃지는 집은 점 옆에 붙습니다. 자리는 그리기 루프가 매 프레임 옮깁니다. */
  const label = chosen === null ? null : STORES[chosen];

  return (
    <div ref={wrapRef} className="globe">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        data-static={interactive ? undefined : ""}
        onPointerDown={interactive ? pointerDown : undefined}
        onPointerMove={interactive ? pointerMove : undefined}
        onPointerUp={
          interactive
            ? (event) => {
                dragging.current = false;
                // 돌리려고 끈 것이 아니라 점을 집은 것이면 뱃지를 띄우고 알립니다.
                if (dragged.current < 4) {
                  const hit = activeRef.current;
                  chosenRef.current = hit;
                  setChosen(hit);
                  onPickStore?.(hit === null ? null : STORES[hit]);
                }
                try {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                } catch {
                  // 캡처가 없었으면 놓을 것도 없습니다.
                }
              }
            : undefined
        }
        onPointerLeave={
          interactive
            ? () => {
                dragging.current = false;
                hovering.current = false;
                activeRef.current = null;
              }
            : undefined
        }
      />

      {/* 늘 떠 있는 나라 이름표 */}
      {labels &&
        tagged.map((entry, i) => (
          <div
            key={entry.city}
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
            className="globe-badge globe-tag"
            data-on=""
            data-off=""
            aria-hidden
          >
            <span>{entry.country}</span>
            <span className="globe-badge-divider">|</span>
            <span>{entry.city}</span>
          </div>
        ))}

      {/* 매장 보유국 위에서 오른쪽으로 펼쳐지는 이름표 */}
      {interactive && (
        <div
          ref={badgeRef}
          className="globe-badge"
          aria-hidden
        >
          {label && (
            <>
              <span>{label.country}</span>
              <span className="globe-badge-divider">|</span>
              <span>{label.city}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
