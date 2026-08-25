"use client";

/** 종이에 인쇄한 듯한 지구본. 나라 경계와 눈금선만 얇게 남고 천천히 돕니다. */

import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { useEffect, useMemo, useRef, useState } from "react";
import { mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { MultiLineString } from "geojson";

import { STORES } from "@/data/gentle-monster-stores";

/** 가만히 두면 이 속도로 천천히 돕니다(도/초) */
const SPIN = 3.4;
/** 받침대에 꽂힌 지구본처럼 축을 기울여 둡니다. */
const TILT = -8;
/** 눈금선. 10도 간격입니다. */
const GRID = geoGraticule10();
/** 이름표를 띄우는 한계 각도. 90도가 지평선이라 가장자리에 닿기 전에 접습니다. */
const TAG_LIMIT = Math.PI * 0.4;
/** 이름표를 점 오른쪽으로 띄우는 거리 */
const TAG_GAP = 14;
/** 늘 이름표를 다는 도시. 대륙마다 하나씩 골라 서로 겹치지 않게 둡니다. */
const TAGGED = [
  "Seoul",
  "Los Angeles",
  "Sydney",
  "Kuala Lumpur",
  "Milan",
  "Dubai",
];

export function GlobePaper() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagged = useMemo(
    () => TAGGED.map((city) => STORES.find((store) => store.city === city)!),
    [],
  );
  const [borders, setBorders] = useState<MultiLineString | null>(null);
  /** 판이 화면 안에 있는지. 밖에 있으면 그리지 않고 쉽니다. */
  const seen = useRef(true);

  useEffect(() => {
    let alive = true;
    import("world-atlas/countries-110m.json").then((mod) => {
      if (!alive) return;
      const topo = (mod.default ?? mod) as unknown as Topology<{
        countries: GeometryCollection;
      }>;
      /* 나라와 나라가 맞닿은 선만 뽑습니다. 폴리곤을 다 그리면 같은 선이 두 번 겹칩니다. */
      setBorders(mesh(topo, topo.objects.countries) as MultiLineString);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !borders) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const projection = geoOrthographic().clipAngle(90);
    let path = geoPath(projection, ctx);
    let width = 0;
    let height = 0;
    let radius = 0;
    /** 화면 배율. 판이 확대돼 있어도 선이 뭉개지지 않게 해상도를 올립니다. */
    let ratio = 1;
    let turn = 0;
    let last = 0;
    let frame = 0;

    function resize() {
      const box = wrap!.getBoundingClientRect();
      width = wrap!.offsetWidth;
      height = wrap!.offsetHeight;
      if (!width || !height) return;

      const zoom = box.width / width;
      ratio = Math.min(3, (window.devicePixelRatio || 1) * zoom);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);

      radius = (Math.min(width, height) / 2) * 0.92;
      projection.scale(radius).translate([width / 2, height / 2]);
      path = geoPath(projection, ctx!);
    }

    function draw(now: number) {
      if (!seen.current) {
        last = 0;
        frame = requestAnimationFrame(draw);
        return;
      }

      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      turn += SPIN * dt;
      projection.rotate([turn, TILT]);

      ctx!.clearRect(0, 0, width, height);

      /* 공. 왼쪽 위에서 빛이 드는 것처럼 아주 옅게 굴립니다. */
      const ball = ctx!.createRadialGradient(
        width / 2 - radius * 0.35,
        height / 2 - radius * 0.4,
        radius * 0.1,
        width / 2,
        height / 2,
        radius * 1.12,
      );
      ball.addColorStop(0, "#f5f3ea");
      ball.addColorStop(0.55, "#eceadf");
      ball.addColorStop(1, "#dcd9cb");
      ctx!.beginPath();
      path({ type: "Sphere" });
      ctx!.fillStyle = ball;
      ctx!.fill();

      /* 눈금선 */
      ctx!.beginPath();
      path(GRID);
      ctx!.strokeStyle = "rgba(108, 110, 96, 0.28)";
      ctx!.lineWidth = 0.4;
      ctx!.stroke();

      /* 나라 경계 */
      ctx!.beginPath();
      path(borders!);
      ctx!.strokeStyle = "rgba(96, 98, 84, 0.6)";
      ctx!.lineWidth = 0.6;
      ctx!.stroke();

      /* 공의 가장자리 */
      ctx!.beginPath();
      path({ type: "Sphere" });
      ctx!.strokeStyle = "rgba(96, 98, 84, 0.25)";
      ctx!.lineWidth = 0.7;
      ctx!.stroke();

      /* 매장이 있는 도시. 앞면에 온 것만 찍습니다. */
      const center: [number, number] = [-turn, -TILT];
      const unit = Math.max(0.5, radius / 320);

      for (const store of STORES) {
        if (geoDistance(store.at, center) > Math.PI / 2) continue;
        const point = projection(store.at);
        if (!point) continue;
        const r = (store.flagship ? 6 : 4.6) * unit;

        /* 바탕색 링을 먼저 깔아 눈금선 위에서 점을 떼어 놓습니다. */
        ctx!.beginPath();
        ctx!.arc(point[0], point[1], r * 1.75, 0, Math.PI * 2);
        ctx!.fillStyle = "#f2f0e6";
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(point[0], point[1], r, 0, Math.PI * 2);
        ctx!.fillStyle = "#191919";
        ctx!.fill();
      }

      /* 이름표는 캔버스가 아니라 DOM 이라 글꼴과 배경을 다른 장과 같이 씁니다. */
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

        const left = point[0] + TAG_GAP;
        const top = point[1] - tag.offsetHeight / 2;
        /* 한 귀퉁이라도 판을 벗어나면 그 자리에서 접습니다. */
        if (
          left < 0 ||
          top < 0 ||
          left + tag.offsetWidth > width ||
          top + tag.offsetHeight > height
        ) {
          tag.dataset.off = "";
          return;
        }

        delete tag.dataset.off;
        tag.style.translate = `${left}px calc(${point[1]}px - 50%)`;
      });

      frame = requestAnimationFrame(draw);
    }

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
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      eye.disconnect();
      observer.disconnect();
    };
  }, [borders, tagged]);

  return (
    <div ref={wrapRef} className="globe">
      <canvas ref={canvasRef} className="globe-canvas" data-static="" />

      {/* 늘 떠 있는 나라 이름표 */}
      {tagged.map((entry, i) => (
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
    </div>
  );
}
