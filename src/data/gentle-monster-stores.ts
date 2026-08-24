export type Store = {
  city: string;
  country: string;
  /** 대표 매장 이름 */
  name: string;
  /** [경도, 위도] — d3-geo 가 쓰는 순서입니다. */
  at: [number, number];
  /** 브랜드를 대표하는 곳은 지구본에서 조금 더 크게 찍습니다. */
  flagship?: boolean;
};

/**
 * 젠틀몬스터 글로벌 스토어.
 * 좌표는 도시 기준의 대표값입니다 — 지구본을 돌려 도시를 찾는 흐름을 보이기 위한
 * 참고용 데이터이고, 실제 매장 주소·목록은 브랜드 공식 페이지를 따릅니다.
 */
export const STORES: Store[] = [
  { city: "Seoul", country: "South Korea", name: "Haus Dosan", at: [127.0388, 37.524], flagship: true },
  { city: "Busan", country: "South Korea", name: "Gentle Monster Busan", at: [129.16, 35.158] },
  { city: "Tokyo", country: "Japan", name: "Gentle Monster Tokyo", at: [139.6503, 35.6762], flagship: true },
  { city: "Beijing", country: "China", name: "Gentle Monster Beijing", at: [116.4074, 39.9042] },
  { city: "Shanghai", country: "China", name: "Haus Shanghai", at: [121.4737, 31.2304], flagship: true },
  { city: "Chengdu", country: "China", name: "Gentle Monster Chengdu", at: [104.0668, 30.5728] },
  { city: "Hong Kong", country: "China", name: "Gentle Monster Hong Kong", at: [114.1694, 22.3193] },
  { city: "Taipei", country: "Taiwan", name: "Gentle Monster Taipei", at: [121.5654, 25.033] },
  { city: "Singapore", country: "Singapore", name: "Gentle Monster Singapore", at: [103.8198, 1.3521] },
  { city: "Bangkok", country: "Thailand", name: "Gentle Monster Bangkok", at: [100.5018, 13.7563] },
  { city: "Kuala Lumpur", country: "Malaysia", name: "Gentle Monster Kuala Lumpur", at: [101.6869, 3.139] },
  { city: "Dubai", country: "UAE", name: "Gentle Monster Dubai", at: [55.2708, 25.2048] },
  { city: "London", country: "United Kingdom", name: "Gentle Monster London", at: [-0.1278, 51.5074], flagship: true },
  { city: "Paris", country: "France", name: "Gentle Monster Paris", at: [2.3522, 48.8566] },
  { city: "Milan", country: "Italy", name: "Gentle Monster Milan", at: [9.19, 45.4642] },
  { city: "New York", country: "United States", name: "Haus Nowhere New York", at: [-74.006, 40.7128], flagship: true },
  { city: "Los Angeles", country: "United States", name: "Gentle Monster Los Angeles", at: [-118.2437, 34.0522] },
  { city: "Sydney", country: "Australia", name: "Gentle Monster Sydney", at: [151.2093, -33.8688] },
];
