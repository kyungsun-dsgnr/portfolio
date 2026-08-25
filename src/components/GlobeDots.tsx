"use client";

import {
  geoBounds,
  geoContains,
  geoDistance,
  geoEquirectangular,
  geoOrthographic,
  geoProjection,
  geoPath,
} from "d3-geo";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";

import { SPOTS, STORES } from "@/data/gentle-monster-stores";

/** 손을 뗀 뒤 속도가 잦아드는 시간 상수(초). 클수록 오래 미끄러집니다. */
const GLIDE = 0.45;
/** 가만히 두면 이 속도로 천천히 돕니다(도/초) */
const IDLE_SPIN = 3.6;
/** 드래그가 만들어 낼 수 있는 최대 속도(도/초) */
const MAX_SPEED = 720;
/** 손끝 1px 이 판 짧은 쪽을 가로지를 때 도는 각도의 기준(도). 작을수록 무겁게 돕니다. */
const DRAG_TURN = 165;
/** 받침대에 꽂힌 지구본처럼 축을 고정합니다. 세로로는 돌지 않아 극이 정면에 오지 않습니다. */
const TILT = -6;
/** 매장을 집을 수 있는 반경(px) */
const HIT_RADIUS = 14;
/** 이름표를 띄우는 한계 각도. 90도가 지평선이라, 가장자리에 닿기 전에 접습니다. */
const TAG_LIMIT = Math.PI * 0.4;
/** 멈춘 지구본이 첫 도시를 가운데에서 서쪽으로 미는 각도(도) */
const STILL_TURN = 35;
/** 구와 평면 사이를 오가는 투영.
    t=0 이면 정사영(지구본), t=1 이면 등장방형(평면 지도)입니다.
    두 raw 를 그대로 섞어 그 사이를 부드럽게 지나갑니다. */
const QUARTER = Math.PI / 2;
function blended(t: number) {
  const raw = (lambda: number, phi: number): [number, number] => [
    (1 - t) * Math.cos(phi) * Math.sin(lambda) + (t * lambda) / QUARTER,
    (1 - t) * Math.sin(phi) + (t * phi) / QUARTER,
  ];
  return geoProjection(raw).clipAngle(clipFor(t));
}
/**
 * 뒤로 넘어간 면을 얼마나 접어 둘지(도).
 * 구일 때는 반구까지만 보이고, 거의 평면이 되면 뒷면까지 펴서 대륙이 죽 이어집니다.
 * 접힌 기가 남은 동안 펴 버리면 가장자리가 겹쳐 보여서, 다 펴진 끝에서만 엽니다.
 */
function clipFor(t: number) {
  const open = Math.max(0, (t - 0.82) / 0.18);
  return 90 + 89 * open * open;
}
/** 이 배율에서 구가 완전히 평면이 됩니다. 그 위로는 커지기만 합니다. */
const FLAT = 1.7;
/** 손으로 키울 수 있는 한계 배율 */
const MAX_MAG = 40;
/** 확대해도 점이 이만큼 떨어져 보이도록 다시 찍습니다(px). 클수록 성깁니다. */
const DOT_GAP = 6;
/** 가장 촘촘한 단계. 한 단계마다 간격이 절반이 됩니다. */
const MAX_LEVEL = 6;

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
function rasterize(
  shape: FeatureCollection,
  w = RASTER_W,
  h = RASTER_H,
): Uint8ClampedArray | null {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d");
  if (!ctx) return null;

  const projection = geoEquirectangular()
    .scale(w / (2 * Math.PI))
    .translate([w / 2, h / 2]);

  ctx.beginPath();
  geoPath(projection, ctx)(shape);
  ctx.fillStyle = "#000";
  ctx.fill();

  return ctx.getImageData(0, 0, w, h).data;
}

/** 도형을 주어진 투영으로 칠해서 알파만 돌려줍니다. */
function inkMask(
  shape: FeatureCollection,
  projection: ReturnType<typeof geoEquirectangular>,
  w: number,
  h: number,
) {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d");
  if (!ctx) return null;
  ctx.beginPath();
  geoPath(projection, ctx)(shape);
  ctx.fillStyle = "#000";
  ctx.fill();
  return ctx.getImageData(0, 0, w, h).data;
}

/**
 * 보이는 자리만 원하는 간격으로 다시 찍습니다.
 * 세계 전체를 촘촘한 해상도로 들고 있으면 무거우니,
 * 그때 보이는 만큼만 점 간격의 절반 크기로 그려서 땅인지 봅니다.
 */
function windowDots(
  land: FeatureCollection,
  homelands: FeatureCollection,
  lon0: number,
  lat0: number,
  halfLon: number,
  halfLat: number,
  step: number,
): Dot[] {
  const wide = Math.min(2048, Math.max(64, Math.round((4 * halfLon) / step)));
  const tall = Math.min(
    2048,
    Math.max(16, Math.round((wide * halfLat) / halfLon)),
  );
  const rad = Math.PI / 180;
  const sc = wide / 2 / (halfLon * rad);
  const projection = geoEquirectangular()
    .rotate([-lon0, 0])
    .scale(sc)
    .translate([wide / 2, tall / 2 + sc * lat0 * rad]);

  const inked = inkMask(land, projection, wide, tall);
  const homed = inkMask(homelands, projection, wide, tall);
  if (!inked || !homed) return [];

  const dots: Dot[] = [];
  const south = Math.max(-84, lat0 - halfLat);
  const north = Math.min(84, lat0 + halfLat);

  /* 격자를 세계 좌표에 걸어 두면 화면을 옮겨 다시 찍어도 점이 제자리를 지킵니다.
     화면 기준으로 찍으면 지도를 끌 때마다 점이 자잘하게 흔들립니다. */
  for (let lat = Math.ceil(south / step) * step; lat <= north; lat += step) {
    const lonStep = step / Math.max(0.2, Math.cos(lat * rad));
    const east = lon0 + halfLon;
    const y = Math.round(tall / 2 - (lat - lat0) * sc * rad);
    if (y < 0 || y >= tall) continue;

    for (
      let lon = Math.ceil((lon0 - halfLon) / lonStep) * lonStep;
      lon <= east;
      lon += lonStep
    ) {
      const off = ((((lon - lon0 + 180) % 360) + 360) % 360) - 180;
      const x = Math.round(wide / 2 + off * sc * rad);
      if (x < 0 || x >= wide) continue;
      const i = (y * wide + x) * 4 + 3;
      if (inked[i] <= 128) continue;
      const around = ((((lon + 180) % 360) + 360) % 360) - 180;
      dots.push({ at: [around, lat], home: homed[i] > 128 });
    }
  }

  // 짙은 점을 뒤로 모아 두면 색깔마다 한 번씩만 칠하면 됩니다.
  dots.sort((a, b) => Number(a.home) - Number(b.home));
  return dots;
}

/** 겹쳐 보여 하나로 묶인 매장. i 는 대표 매장입니다. */
type Clump = { i: number; x: number; y: number; members: number[] };

/** 한 단계의 촘촘한 격자. 단계가 바뀔 때는 둘을 겹쳐서 넘깁니다. */
type Grid = {
  level: number;
  lon: number;
  lat: number;
  half: [number, number];
  dots: Dot[];
  /** 짙은 점이 시작되는 자리 */
  homeFrom: number;
  alpha: number;
  /** 화면 좌표를 담아 둡니다. 돌리거나 키우지 않았으면 다시 계산하지 않습니다. */
  key?: string;
  xy?: Float32Array;
};

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
  /** 이름표를 누르면 그 아래로 매장 카드가 열립니다. */
  card?: boolean;
  /** 이 도시를 고른 채로 시작합니다. */
  openAt?: string;
  /** 돌지 않고 멈춰 있는 지구본. 첫 도시가 정면에 옵니다. */
  still?: boolean;
  /** 점 뒤에 깔리는 구의 흰 기운(0~1). 바탕과 구를 갈라 보이게 합니다. */
  veil?: number;
  /** 어두운 판 위에 놓입니다. 점과 핀의 밝기를 뒤집습니다. */
  dark?: boolean;
};

export function GlobeDots({
  interactive = true,
  labels = false,
  tags,
  still = false,
  veil = 0.29,
  dark = false,
  onPickStore,
  card = false,
  openAt,
}: Props) {
  /** 처음부터 골라 둘 매장 */
  const opening = openAt
    ? STORES.findIndex((store) => store.city === openAt)
    : -1;
  const tagged = useMemo(
    () =>
      (tags ?? TAGGED).map((city) =>
        STORES.find((store) => store.city === city)!,
      ),
    [tags],
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dots, setDots] = useState<Dot[] | null>(null);
  /** 집어 둔 매장. 뱃지는 이때만 뜹니다. */
  const chosenRef = useRef<number | null>(opening < 0 ? null : opening);
  /* 배율. 1 이 지구본이고, 키우면 평면으로 펴지면서 커집니다.
     매장이 여럿인 나라를 고르면 그 나라에 맞는 배율로 저절로 갑니다. */
  const mag = useRef(1);
  const magTo = useRef(1);
  /** 배율에서 끌어낸 펴진 정도(0~1)와, 투영을 마지막으로 새로 만든 값 */
  const spread = useRef(0);
  const spreadAt = useRef(0);
  /** 펼칠 때 가운데로 데려올 경도·위도 */
  const facing = useRef<[number, number] | null>(null);
  /** 펼친 나라가 화면을 채우도록 맞출 경도·위도 폭(라디안) */
  const fitSpan = useRef<[number, number] | null>(null);
  /** 그 폭에서 구한 배율. 손으로 더 키우거나 줄일 때 기준이 됩니다. */
  const fitMag = useRef(1);
  /* 확대했을 때 쓰는 촘촘한 격자. 앞이 지금 단계, 뒤는 물러나는 중인 이전 단계입니다. */
  const grids = useRef<Grid[]>([]);
  const landRef = useRef<FeatureCollection | null>(null);
  const homelandRef = useRef<FeatureCollection | null>(null);
  /* 화면에 찍히는 매장. 평소에는 도시 하나에 하나이고,
     나라를 펼치면 그 나라 안 개별 매장이 뒤에 덧붙습니다.
     앞쪽 차례는 그대로라 이미 고른 매장의 번호가 어긋나지 않습니다. */
  const pins = useRef<(typeof STORES)[number][]>(STORES);
  /** 뱃지에 쓸 매장. pins 는 그리기용이라 화면 그릴 때는 이 값을 봅니다. */
  const [label, setLabel] = useState<(typeof STORES)[number] | null>(
    opening < 0 ? null : STORES[opening],
  );
  /** 이름표를 눌러 카드를 펼친 참 */
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
    opening >= 0
      ? -STORES[opening].at[0] - STILL_TURN
      : still
        ? -tagged[0].at[0] - STILL_TURN
        : -10,
    TILT,
  ]);
  const velocity = useRef<[number, number]>([
    still || opening >= 0 ? 0 : IDLE_SPIN,
    0,
  ]);
  /** 프레임/이벤트 간격을 재서 회전을 시간 기준으로 굴립니다. */
  const lastFrame = useRef(0);
  const lastMove = useRef(0);
  const dragging = useRef(false);
  const last = useRef<[number, number]>([0, 0]);
  const activeRef = useRef<number | null>(null);
  /* 캔버스 색은 CSS 가 닿지 않으므로 여기서 두 벌을 들고 있습니다. */
  const ink = useMemo(
    () =>
      dark
        ? {
            // 어두운 판에서는 땅을 모두 흰빛으로 두고 밝기로만 가릅니다.
            plain: "250, 250, 250",
            home: "250, 250, 250",
            pin: "#fafafa",
            ring: "#191919",
            edge: "rgba(250, 250, 250, 0.55)",
            shade: "250, 250, 250",
          }
        : {
            plain: "125, 125, 125",
            home: "60, 60, 60",
            pin: "#191919",
            ring: "#fafafa",
            edge: "rgba(25, 25, 25, 0.5)",
            shade: "25, 25, 25",
          },
    [dark],
  );

  /** 판이 화면 안에 있는지. 밖에 있으면 그리지 않고 쉽니다. */
  const seen = useRef(true);
  const screen = useRef<Clump[]>([]);
  /** 집어 둔 점에 묶인 매장. 카드에 목록으로 폅니다. */
  const [group, setGroup] = useState<(typeof STORES)[number][]>([]);
  const groupAt = useRef("");

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
      landRef.current = land;
      homelandRef.current = homelands;
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

    let projection = projectionRef.current;
    // 구를 흰색으로 채울 때 씁니다. 반지름/중심을 따로 계산하지 않아도 됩니다.
    let path = geoPath(projection, ctx);
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

    /* 화면 밖으로 나간 지구본은 그리지 않습니다.
       한 쪽에 여럿이 놓여 있어서, 안 보이는 것까지 매 프레임 그리면
       지금 보고 있는 지구본이 그만큼 느려집니다. */
    const eye = new IntersectionObserver(
      ([entry]) => {
        seen.current = entry.isIntersecting;
      },
      { rootMargin: "20%" },
    );
    eye.observe(wrap);

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    let frame = 0;

    function draw() {
      if (!seen.current) {
        // 돌아왔을 때 흐른 시간이 한꺼번에 밀려들지 않게 시계를 끊어 둡니다.
        lastFrame.current = 0;
        frame = requestAnimationFrame(draw);
        return;
      }

      const now = performance.now();
      // 탭이 뒤에 있다 돌아왔을 때 한 번에 튀지 않게 상한을 둡니다.
      const dt = lastFrame.current
        ? Math.min(0.05, (now - lastFrame.current) / 1000)
        : 0;
      lastFrame.current = now;

      if (!dragging.current && dt) {
        // 마우스를 올리면 돌던 것이 잦아들고, 벗어나면 다시 천천히 돕니다.
        // 프레임 수가 아니라 흐른 시간으로 계산해 화면 주사율과 무관하게 같은 속도가 납니다.
        /* 점을 집어 둔 동안에는 멈춥니다. 이름표가 따라 움직이면 읽기 어렵습니다. */
        const idle =
          still ||
          chosenRef.current !== null ||
          mag.current > 1.02 ||
          (interactive && hovering.current)
            ? 0
            : IDLE_SPIN;
        const decay = Math.exp(-dt / GLIDE);
        const vx = velocity.current[0] * decay + idle * (1 - decay);
        velocity.current = [vx, 0];
        rotation.current = [rotation.current[0] + vx * dt, rotation.current[1]];
      }

      /* 펼침은 시간을 두고 따라갑니다. 목표 나라도 가운데로 데려옵니다. */
      if (dt) {
        const ease = 1 - Math.exp(-dt / 0.32);
        mag.current += (magTo.current - mag.current) * ease;
        // FLAT 배까지 키우는 동안 구가 평면으로 펴지고, 그 뒤로는 커지기만 합니다.
        spread.current = Math.min(
          1,
          Math.max(0, (mag.current - 1) / (FLAT - 1)),
        );
        if (facing.current) {
          const [lon, lat] = facing.current;
          const turn = ((-lon - rotation.current[0] + 540) % 360) - 180;
          rotation.current = [
            rotation.current[0] + turn * ease,
            rotation.current[1] + (-lat - rotation.current[1]) * ease,
          ];
        } else if (spread.current < 0.999) {
          // 접힐 때는 기울기를 원래대로 되돌립니다. 평면에서는 옮긴 자리를 둡니다.
          rotation.current = [
            rotation.current[0],
            rotation.current[1] + (TILT - rotation.current[1]) * ease,
          ];
        }
      }

      // 펴진 만큼 투영을 새로 만듭니다. 값이 거의 안 변하면 그대로 씁니다.
      if (Math.abs(spread.current - spreadAt.current) > 0.004) {
        spreadAt.current = spread.current;
        projection = blended(spread.current);
        projectionRef.current = projection;
        path = geoPath(projection, ctx);
      }
      /* 고른 나라가 판을 거의 채울 배율. 손으로 더 키우거나 줄일 수 있습니다. */
      if (fitSpan.current) {
        const [dLon, dLat] = fitSpan.current;
        const want = Math.min(
          (width * 0.82 * QUARTER) / dLon,
          (height * 0.82 * QUARTER) / dLat,
        );
        fitMag.current = Math.min(MAX_MAG, Math.max(1, want / radius));
        fitSpan.current = null;
        magTo.current = fitMag.current;
      }
      const scale = radius * mag.current;
      projection.translate([width / 2, height / 2]).scale(scale);
      /* 점 간격이 화면에서 일정해 보이도록, 배율에 맞는 격자 단계를 고릅니다.
         한 단계 오를 때마다 간격이 절반이 됩니다. */
      const level = Math.max(
        0,
        Math.min(
          MAX_LEVEL,
          Math.round(Math.log2((LAT_STEP * scale) / (DOT_GAP * 90))),
        ),
      );

      const __t0 = performance.now();
      projection.rotate(rotation.current);
      ctx!.clearRect(0, 0, width, height);

      /* 지구본 아래 그림자. 구를 칠하기 전에 그려 뒤로 보냅니다.
         납작한 타원이라 원형 그라디언트를 세로로 눌러서 씁니다. */
      /* 그림자와 흰 기운은 '구'를 떼어 보이게 하는 것들입니다.
         평면이 되면 구가 아니라 판이라, 남아 있으면 네모난 자국으로 드러납니다. */
      const round = 1 - spread.current;
      const shade = radius * 0.58;
      ctx!.save();
      ctx!.translate(width / 2, height / 2 + radius * 1.05);
      ctx!.scale(1, 0.12);
      const glow = ctx!.createRadialGradient(0, 0, 0, 0, 0, shade);
      glow.addColorStop(0, `rgba(${ink.shade}, ${0.005 * round})`);
      glow.addColorStop(0.5, `rgba(${ink.shade}, ${0.002 * round})`);
      glow.addColorStop(1, `rgba(${ink.shade}, 0)`);
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(0, 0, shade, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      // 페이지 바탕과 구분되도록 지구본 원 안쪽만 흰색으로 깝니다.
      ctx!.beginPath();
      path(sphere);
      ctx!.fillStyle = `rgba(255, 255, 255, ${veil * round})`;
      ctx!.fill();

      const center: [number, number] = [
        -rotation.current[0],
        -rotation.current[1],
      ];
      /* 가장자리로 갈수록 옅어지게 세 겹으로 나누고, 매장 보유국은 따로 모읍니다.
         한 겹마다 fill 한 번이라 점이 수천 개여도 부담이 적습니다. */
      const plain: [number, number][][] = [[], [], []];
      const home: [number, number][][] = [[], [], []];

      /* 접어 둔 만큼만 그립니다. 평면이 되면 뒷면 대륙까지 들어옵니다. */
      const reach = (clipFor(spread.current) * Math.PI) / 180;

      for (const dot of dots!) {
        const d = geoDistance(dot.at, center);
        if (d > reach) continue;
        const point = projection(dot.at);
        if (!point) continue;
        // 0(정면) ~ 1(가장자리)
        const edge = Math.min(1, d / reach);
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
         크기는 같고 색과 진하기로만 갈립니다.
         펼쳐 크게 볼 때는 1.5도 격자가 너무 성겨서 함께 물러납니다. */
      const dot = 2 * unit;

      /* 키울수록 1.5도 격자로는 성겨집니다. 보이는 자리만 그만큼 촘촘히 다시 찍고,
         단계가 바뀌는 사이에는 둘을 겹쳐 넘겨 점이 튀지 않게 합니다. */
      /* 다 펴진 뒤에만 씁니다. 접힌 기가 남은 동안에는 뒷면이 앞으로 접혀 와서
         화면 밖 점까지 앞에 겹쳐 찍힙니다. 그때는 성긴 격자가 각도로 걸러 줍니다. */
      const flat = spread.current > 0.999;
      /* 배율이 아직 움직이는 중. 이때 격자를 다시 찍으면 프레임마다 버려질 것을
         만드느라 화면이 끊깁니다. 멈춘 뒤에 한 번만 찍습니다. */
      const busy = Math.abs(magTo.current - mag.current) > mag.current * 0.015;
      const step = LAT_STEP / 2 ** level;
      const halfLon = ((width / 2) * 90) / scale;
      const halfLat = ((height / 2) * 90) / scale;
      const front = grids.current[0];
      const worn =
        !front ||
        front.level !== level ||
        halfLon > front.half[0] ||
        halfLat > front.half[1] ||
        // 같은 단계에서 더 키웠으면 넓게 찍어 둔 자리가 남아돕니다.
        front.half[0] > halfLon * 2.5 ||
        Math.abs(front.lon - center[0]) > front.half[0] * 0.2 ||
        Math.abs(front.lat - center[1]) > front.half[1] * 0.2;

      if (
        level > 0 &&
        flat &&
        !busy &&
        worn &&
        landRef.current &&
        homelandRef.current
      ) {
        // 화면보다 넉넉히 찍어 두어 조금 돌린다고 곧바로 다시 찍지 않게 합니다.
        const half: [number, number] = [
          Math.min(180, halfLon * 1.45),
          Math.min(84, halfLat * 1.45),
        ];
        const fresh = windowDots(
          landRef.current,
          homelandRef.current,
          center[0],
          center[1],
          half[0],
          half[1],
          step,
        );
        const at = fresh.findIndex((one) => one.home);
        const older = front && front.alpha > 0.02 ? [front] : [];
        grids.current = [
          {
            level,
            lon: center[0],
            lat: center[1],
            half,
            dots: fresh,
            homeFrom: at < 0 ? fresh.length : at,
            alpha: 0,
          },
          ...older,
        ];
      }

      /* 맨 앞 단계가 짙어지고 나머지는 물러납니다. 지구본으로 돌아오면 모두 물러납니다. */
      if (dt) {
        const ease = 1 - Math.exp(-dt / 0.18);
        grids.current.forEach((grid, i) => {
          const to = level > 0 && flat && !busy && i === 0 ? 1 : 0;
          grid.alpha += (to - grid.alpha) * ease;
        });
        grids.current = grids.current.filter(
          (grid, i) => i === 0 || grid.alpha > 0.02,
        );
        if ((level === 0 || !flat) && grids.current[0]?.alpha <= 0.02)
          grids.current = [];
      }

      /* 촘촘한 격자가 자리를 채운 만큼 성긴 격자는 물러납니다. */
      const fine = grids.current.reduce(
        (most, g) => Math.max(most, g.alpha),
        0,
      );
      const thin = 1 - fine;
      if (thin > 0.02) {
        paint(plain, dot, ink.plain, [0.5 * thin, 0.36 * thin, 0.2 * thin]);
        paint(home, dot, ink.home, [0.95 * thin, 0.7 * thin, 0.42 * thin]);
      }

      /* 촘촘한 격자. 돌리지도 키우지도 않았다면 지난 프레임의 자리를 그대로 씁니다. */
      const key = `${scale.toFixed(2)}|${rotation.current[0].toFixed(3)}|${rotation.current[1].toFixed(3)}|${spread.current.toFixed(3)}`;
      for (const grid of grids.current) {
        const lit = grid.alpha;
        if (lit < 0.02) continue;
        if (grid.key !== key || !grid.xy) {
          const xy = new Float32Array(grid.dots.length * 2);
          grid.dots.forEach((one, i) => {
            const point = projection(one.at);
            xy[i * 2] = point ? point[0] : NaN;
            xy[i * 2 + 1] = point ? point[1] : NaN;
          });
          grid.key = key;
          grid.xy = xy;
        }

        const xy = grid.xy;
        const shade = (
          from: number,
          to: number,
          rgb: string,
          alpha: number,
        ) => {
          ctx!.beginPath();
          for (let i = from; i < to; i++) {
            const x = xy[i * 2];
            const y = xy[i * 2 + 1];
            if (Number.isNaN(x) || x < -dot || x > width + dot) continue;
            if (y < -dot || y > height + dot) continue;
            ctx!.rect(x - dot / 2, y - dot / 2, dot, dot);
          }
          ctx!.fillStyle = `rgba(${rgb}, ${alpha * lit})`;
          ctx!.fill();
        };
        shade(0, grid.homeFrom, ink.plain, 0.5);
        shade(grid.homeFrom, grid.dots.length, ink.home, 0.95);
      }

      // 매장
      const spots: { i: number; x: number; y: number }[] = [];
      pins.current.forEach((store, i) => {
        if (geoDistance(store.at, center) > reach) return;
        const point = projection(store.at);
        if (!point) return;
        spots.push({ i, x: point[0], y: point[1] });
      });

      /* 집는 반경보다 가까이 붙은 매장은 눌러서 가릴 수 없으니 하나로 묶습니다.
         같은 나라끼리만 묶어 이름표의 나라·도시가 어긋나지 않게 합니다. */
      const clumps: Clump[] = [];
      const taken = new Set<number>();
      for (const spot of spots) {
        if (taken.has(spot.i)) continue;
        const country = pins.current[spot.i].country;
        const kin = spots.filter(
          (other) =>
            !taken.has(other.i) &&
            pins.current[other.i].country === country &&
            Math.hypot(other.x - spot.x, other.y - spot.y) <= HIT_RADIUS,
        );
        kin.forEach((one) => taken.add(one.i));
        const members = kin.map((one) => one.i).sort((a, b) => a - b);
        clumps.push({
          // 도시 대표 매장이 목록 앞쪽에 있어 가장 작은 번호가 대표가 됩니다.
          i: members[0],
          x: kin.reduce((sum, one) => sum + one.x, 0) / kin.length,
          y: kin.reduce((sum, one) => sum + one.y, 0) / kin.length,
          members,
        });
      }

      for (const clump of clumps) {
        const store = pins.current[clump.i];
        const isActive = activeRef.current === clump.i;
        // 묶인 수만큼 점이 커집니다. 몇 곳이 겹쳐 있는지가 크기로 보입니다.
        const many = 1 + Math.min(0.9, (clump.members.length - 1) * 0.17);
        const r =
          (store.flagship ? 6 : 4.6) * unit * many * (isActive ? 1.45 : 1);

        // 배경색 링을 먼저 깔아 회색 점밭에서 도시를 떼어 놓습니다.
        ctx!.beginPath();
        ctx!.arc(clump.x, clump.y, r * 1.75, 0, Math.PI * 2);
        ctx!.fillStyle = ink.ring;
        ctx!.fill();

        if (isActive) {
          ctx!.beginPath();
          ctx!.arc(clump.x, clump.y, r * 2.5, 0, Math.PI * 2);
          ctx!.strokeStyle = ink.edge;
          ctx!.lineWidth = unit * 1.2;
          ctx!.stroke();
        }

        ctx!.beginPath();
        ctx!.arc(clump.x, clump.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = ink.pin;
        ctx!.fill();
      }

      screen.current = clumps;

      /* 집어 둔 점에 묶인 매장이 바뀌면 카드 목록도 바꿉니다.
         나라를 펼치면 도시 하나가 여러 매장으로 갈라지므로 매 프레임 확인합니다. */
      const mine = clumps.find((one) => one.i === chosenRef.current);
      const roll = mine ? mine.members.join(",") : "";
      if (roll !== groupAt.current) {
        groupAt.current = roll;
        setGroup(mine ? mine.members.map((m) => pins.current[m]) : []);
      }

      /* 집어 둔 점 옆에 뱃지를 붙입니다. 오른쪽 자리가 모자라면 왼쪽으로 넘깁니다. */
      const badge = badgeRef.current;
      if (badge) {
        const at = mine;
        if (at) {
          const w = badge.offsetWidth;
          const toLeft = at.x + HIT_RADIUS + w > width;
          badge.toggleAttribute("data-left", toLeft);
          const x = toLeft ? at.x - HIT_RADIUS - w : at.x + HIT_RADIUS;
          badge.style.translate = `${x}px calc(${at.y}px - 50%)`;
        }
        badge.toggleAttribute("data-on", Boolean(at));

        // 카드는 이름표 바로 아래에 같은 선으로 붙습니다.
        const box = cardRef.current;
        if (box) {
          if (at) {
            const w = badge.offsetWidth;
            const toLeft = at.x + HIT_RADIUS + w > width;
            const x = toLeft
              ? at.x - HIT_RADIUS - box.offsetWidth
              : at.x + HIT_RADIUS;
            const top = at.y + badge.offsetHeight;
            box.style.translate = `${x}px ${top}px`;
            // 판 아래로 넘치지 않을 만큼만 쌓고, 남은 카드는 그 안에서 굴립니다.
            box.style.maxHeight = `${Math.max(120, height - top - 8)}px`;
          }
          box.toggleAttribute("data-on", Boolean(at) && openRef.current);
        }
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
          const size = (tagSize.current[i] ??= [
            tag.offsetWidth,
            tag.offsetHeight,
          ]);
          const left = point[0] + HIT_RADIUS;
          const top = point[1] - size[1] / 2;
          // 한 귀퉁이라도 판넬을 벗어나면 그 자리에서 접습니다.
          if (
            left < 0 ||
            top < 0 ||
            left + size[0] > width ||
            top + size[1] > height
          ) {
            tag.dataset.off = "";
            return;
          }

          delete tag.dataset.off;
          tag.style.translate = `${left}px calc(${point[1]}px - 50%)`;
        });
      }

      const w = window as unknown as Record<string, number>;
      w.__drawMs = performance.now() - __t0;
      w.__frames = (w.__frames ?? 0) + 1;
      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      eye.disconnect();
      observer.disconnect();
    };
  }, [dots, ink, interactive, labels, still, tagged, veil]);

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
      const dx = event.clientX - last.current[0];
      const dy = event.clientY - last.current[1];
      last.current = [event.clientX, event.clientY];

      const now = performance.now();
      const dt = Math.max(0.008, (now - (lastMove.current || now)) / 1000);
      lastMove.current = now;

      /* 키운 만큼 나누어 둡니다. 그러지 않으면 확대할수록 같은 손짓에
         지도가 몇 배씩 튀어 손을 대기 어려워집니다. */
      const rate = DRAG_TURN / Math.min(box.width, box.height) / mag.current;
      const turned = dx * rate;
      // 평면일 때만 위아래로도 옮깁니다. 구일 때는 축을 세워 둡니다.
      const lifted =
        spread.current > 0.999
          ? Math.max(-84, Math.min(84, rotation.current[1] - dy * rate))
          : rotation.current[1];
      rotation.current = [rotation.current[0] + turned, lifted];
      // 손으로 옮겼으면 골라 둔 나라로 되돌리지 않습니다.
      if (dragged.current > 4) facing.current = null;
      // 놓았을 때 이어질 속도(도/초). 이벤트가 몰리면 과하게 잡히므로 묶어 둡니다.
      const speed = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, turned / dt));
      // 지구본은 손을 떼면 미끄러지지만, 펼친 지도는 놓은 자리에 섭니다.
      velocity.current = [spread.current > 0.999 ? 0 : speed, 0];
      dragged.current += Math.hypot(dx, dy);
      return;
    }

    findStore(event);
  }

  /* 한 점에 여럿이 묶여 있으면 같은 카드가 그 수만큼 아래로 이어집니다. */
  const list = group.length ? group : label ? [label] : [];
  /* 절반을 넘는 도시가 있으면 그 도시의 점으로 봅니다.
     서울 다섯에 성남·고양 하나씩이면 서울이고,
     서울·부산·제주가 하나씩 묶인 점은 어느 도시라 할 수 없어 나라만 적습니다. */
  const tally = new Map<string, number>();
  for (const one of list) tally.set(one.city, (tally.get(one.city) ?? 0) + 1);
  let head = "";
  let most = 0;
  tally.forEach((count, city) => {
    if (count > most) {
      most = count;
      head = city;
    }
  });
  const cityName = most * 2 > list.length ? head : null;

  /* 휠·핀치로 배율을 바꿉니다. 지구본까지 되돌아온 뒤로는 페이지가 대신 넘어갑니다.
     React 의 onWheel 은 preventDefault 가 막히는 경우가 있어 직접 답니다. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !interactive) return;

    function onWheel(event: WheelEvent) {
      // 트랙패드 핀치는 ctrl 을 얹은 휠로 옵니다. 한 번에 크게 움직입니다.
      const step = event.ctrlKey ? 0.008 : 0.0011;
      const next = Math.min(
        MAX_MAG,
        Math.max(1, magTo.current * Math.exp(-event.deltaY * step)),
      );
      if (next === magTo.current) return;
      event.preventDefault();
      magTo.current = next;

      /* 펼치기 시작하면 집어 둔 매장을 가운데로 데려옵니다.
         구일 때는 살짝 비켜 두는 편이 보기 좋지만, 평면에서는 초점이 가장자리로 밀립니다. */
      if (!facing.current && chosenRef.current !== null) {
        facing.current = pins.current[chosenRef.current].at;
      }
    }

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [interactive]);

  /* 뱃지는 집은 점 옆에 붙습니다. 자리는 그리기 루프가 매 프레임 옮깁니다. */

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
                  setLabel(hit === null ? null : pins.current[hit]);
                  openRef.current = false;
                  setOpen(false);

                  /* 매장이 여럿인 나라를 고르면 지도가 평면으로 펴지면서
                     그 나라 쪽으로 커집니다. 나머지 매장까지 함께 보입니다. */
                  const store = hit === null ? null : pins.current[hit];
                  const kin = store
                    ? STORES.filter((one) => one.country === store.country)
                    : [];
                  const land = store
                    ? homelandsRef.current.find(
                        (one) => one.label === store.country,
                      )
                    : undefined;

                  if (kin.length > 1 && land) {
                    const [[west, south], [east, north]] = geoBounds(
                      land.shape,
                    );
                    facing.current = [(west + east) / 2, (south + north) / 2];
                    fitSpan.current = [
                      (Math.max(0.5, east - west) * Math.PI) / 180,
                      (Math.max(0.5, north - south) * Math.PI) / 180,
                    ];
                    // 그 나라 안 개별 매장을 뒤에 덧붙여 함께 보여 줍니다.
                    pins.current = [
                      ...STORES,
                      ...SPOTS.filter((one) => one.country === store!.country),
                    ];
                  } else {
                    magTo.current = 1;
                    fitMag.current = 1;
                    facing.current = null;
                    fitSpan.current = null;
                    pins.current = STORES;
                  }

                  onPickStore?.(store);
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

      {/* 이름표를 누르면 그 아래로 열리는 매장 카드 */}
      {card && (
        <div ref={cardRef} className="globe-card" aria-hidden>
          {open &&
            list.map((one) => (
              <div className="globe-tip" key={one.name}>
                <div className="store-tip-top">
                  <h5 className="store-tip-name">{one.name}</h5>
                  <span className="store-tip-distance">{one.city}</span>
                </div>
                <p className="store-tip-address">{one.country}</p>
                <div className="store-tip-tags">
                  {["피팅 서비스", "간편 수리", "수리 제품 픽업"].map(
                    (service) => (
                      <span className="store-tip-tag" key={service}>
                        {service}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

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
          data-tap={card || undefined}
          onClick={
            card
              ? () => {
                  openRef.current = !openRef.current;
                  setOpen(openRef.current);
                }
              : undefined
          }
          aria-hidden
        >
          {label && (
            <>
              <span>{label.country}</span>
              {/* 한 점에 여럿이 묶였으면 몇 곳인지 함께 적습니다. */}
              {cityName ? (
                <>
                  <span className="globe-badge-divider">|</span>
                  <span>
                    {cityName}
                    {list.length > 1 ? ` (${list.length})` : ""}
                  </span>
                </>
              ) : (
                <span>({list.length})</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
