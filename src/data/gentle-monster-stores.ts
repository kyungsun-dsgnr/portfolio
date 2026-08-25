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

/**
 * 도시 안에 흩어진 개별 매장.
 * 나라를 펼쳐 크게 볼 때만 드러납니다 — 지구본 상태에서는 도시 하나에 점 하나입니다.
 * 좌표는 도시 안 대략적인 자리이고, 실제 주소는 브랜드 공식 페이지를 따릅니다.
 */
export const SPOTS: Store[] = [
  { city: "Seoul", country: "South Korea", name: "젠틀몬스터 신세계 강남", at: [127.0043, 37.5045] },
  { city: "Seoul", country: "South Korea", name: "젠틀몬스터 성수", at: [127.0557, 37.5445] },
  { city: "Seoul", country: "South Korea", name: "젠틀몬스터 더현대 서울", at: [126.9285, 37.5259] },
  { city: "Seoul", country: "South Korea", name: "젠틀몬스터 롯데월드몰", at: [127.1028, 37.5133] },
  { city: "Suwon", country: "South Korea", name: "젠틀몬스터 갤러리아 광교", at: [127.0533, 37.2857] },
  { city: "Seongnam", country: "South Korea", name: "젠틀몬스터 현대 판교", at: [127.1116, 37.3947] },
  { city: "Goyang", country: "South Korea", name: "젠틀몬스터 스타필드 고양", at: [126.8895, 37.6469] },
  { city: "Daejeon", country: "South Korea", name: "젠틀몬스터 신세계 대전", at: [127.3893, 36.3745] },
  { city: "Daegu", country: "South Korea", name: "젠틀몬스터 신세계 대구", at: [128.5966, 35.8776] },
  { city: "Jeju", country: "South Korea", name: "젠틀몬스터 제주", at: [126.5219, 33.5127] },
  { city: "Busan", country: "South Korea", name: "젠틀몬스터 신세계 센텀시티", at: [129.13, 35.169] },

  { city: "Tokyo", country: "Japan", name: "Gentle Monster Shinjuku", at: [139.7003, 35.6909] },
  { city: "Tokyo", country: "Japan", name: "Gentle Monster Ginza", at: [139.765, 35.6717] },
  { city: "Osaka", country: "Japan", name: "Gentle Monster Osaka", at: [135.5023, 34.6937] },
  { city: "Fukuoka", country: "Japan", name: "Gentle Monster Fukuoka", at: [130.4017, 33.5904] },

  { city: "Shanghai", country: "China", name: "Gentle Monster Xintiandi", at: [121.4753, 31.2222] },
  { city: "Guangzhou", country: "China", name: "Gentle Monster Guangzhou", at: [113.2644, 23.1291] },
  { city: "Shenzhen", country: "China", name: "Gentle Monster Shenzhen", at: [114.0579, 22.5431] },
  { city: "Hangzhou", country: "China", name: "Gentle Monster Hangzhou", at: [120.1551, 30.2741] },

  { city: "San Francisco", country: "United States", name: "Gentle Monster San Francisco", at: [-122.4194, 37.7749] },
  { city: "Miami", country: "United States", name: "Gentle Monster Miami", at: [-80.1918, 25.7617] },
  { city: "Chicago", country: "United States", name: "Gentle Monster Chicago", at: [-87.6298, 41.8781] },
];
