export type ProjectBlock =
  | { type: "text"; body: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; body: string; source?: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  /** 카드와 상세 상단에 쓰이는 대표 이미지. public/ 기준 경로 (예: "/projects/foo/cover.svg") */
  cover?: string;
  /** cover가 없을 때 쓰이는 플레이스홀더 색 (CSS 그라디언트 두 색) */
  accent: [string, string];
  tags: string[];
  /** 상세 페이지 왼쪽 메타 영역 */
  meta: { label: string; value: string }[];
  /** 케이스 스터디 본문 */
  blocks: ProjectBlock[];
  /** 외부 링크(라이브 사이트, 아티클 등) */
  link?: { label: string; href: string };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "orbit-banking",
    title: "Orbit Banking",
    summary:
      "송금 실패율이 높던 모바일 뱅킹 앱의 이체 플로우를 5단계에서 2단계로 줄인 리디자인.",
    year: "2025",
    role: "Lead Product Designer",
    cover: "/projects/orbit-banking/cover.svg",
    accent: ["#1e3a8a", "#0ea5e9"],
    tags: ["Product", "Mobile", "Design System"],
    featured: true,
    meta: [
      { label: "Client", value: "Orbit Financial" },
      { label: "Year", value: "2025" },
      { label: "Role", value: "리드 디자이너 · 리서치 · 프로토타이핑" },
      { label: "Team", value: "디자이너 2 · 엔지니어 5 · PM 1" },
    ],
    blocks: [
      {
        type: "text",
        body: "이체 화면에서 이탈하는 사용자가 전체의 34%였습니다. 로그를 뜯어 보니 문제는 속도가 아니라 순서였습니다. 사용자는 '얼마를'보다 '누구에게'를 먼저 정하는데, 화면은 반대로 묻고 있었습니다.",
      },
      {
        type: "image",
        src: "/projects/orbit-banking/flow.svg",
        alt: "기존 이체 플로우와 새 플로우 비교 다이어그램",
        caption: "기존 5단계 플로우(위)와 재설계한 2단계 플로우(아래)",
      },
      {
        type: "text",
        body: "최근 송금 대상을 첫 화면으로 끌어올리고, 금액 입력과 확인을 한 화면에 합쳤습니다. 확인 단계를 없애는 대신 전송 버튼을 길게 눌러야 실행되도록 만들어 실수 송금을 막았습니다.",
      },
      {
        type: "quote",
        body: "출시 6주 만에 이체 완료율이 66%에서 91%로 올랐고, 고객센터 문의는 절반으로 줄었습니다.",
      },
    ],
  },
  {
    slug: "field-notes",
    title: "Field Notes",
    summary:
      "독립 출판사의 계간지 아이덴티티와 웹사이트. 인쇄물의 그리드를 그대로 화면으로 옮겼습니다.",
    year: "2024",
    role: "Art Director",
    cover: "/projects/field-notes/cover.svg",
    accent: ["#7c2d12", "#f59e0b"],
    tags: ["Branding", "Editorial", "Web"],
    featured: true,
    meta: [
      { label: "Client", value: "Field Notes Press" },
      { label: "Year", value: "2024" },
      { label: "Role", value: "아트 디렉션 · 타이포그래피 · 웹 디자인" },
    ],
    blocks: [
      {
        type: "text",
        body: "종이 잡지가 먼저 있고 웹은 나중에 붙은 프로젝트였습니다. 두 매체가 따로 놀지 않게 하려면 색이나 로고보다 그리드와 여백의 규칙을 공유해야 한다고 봤습니다.",
      },
      {
        type: "image",
        src: "/projects/field-notes/spread.svg",
        alt: "계간지 펼침면 레이아웃",
      },
      {
        type: "text",
        body: "12칼럼 그리드 하나를 정하고, 인쇄에서는 mm로 화면에서는 rem으로 같은 비율을 유지했습니다. 본문 서체는 화면 가독성을 위해 인쇄본보다 한 단계 큰 광학 사이즈를 썼습니다.",
      },
    ],
  },
  {
    slug: "atlas-design-system",
    title: "Atlas Design System",
    summary:
      "흩어져 있던 4개 제품의 UI를 하나의 토큰 체계로 묶고, 디자인–코드 싱크를 자동화했습니다.",
    year: "2024",
    role: "Design Systems Designer",
    cover: "/projects/atlas-design-system/cover.svg",
    accent: ["#312e81", "#a855f7"],
    tags: ["Design System", "Tokens", "Documentation"],
    meta: [
      { label: "Client", value: "Atlas (사내 프로젝트)" },
      { label: "Year", value: "2024" },
      { label: "Role", value: "토큰 설계 · 컴포넌트 · 문서화" },
      { label: "Scale", value: "제품 4개 · 컴포넌트 62개" },
    ],
    blocks: [
      {
        type: "text",
        body: "같은 회사 제품인데 파란색이 일곱 종류였습니다. 색을 통일하는 것보다, 왜 달라졌는지를 먼저 정리했습니다. 대부분은 '접근성 대비를 맞추려고' 각자 조정한 결과였습니다.",
      },
      {
        type: "text",
        body: "그래서 팔레트를 의미 기준(surface, accent, danger)으로 나누고 명도 단계를 고정했습니다. 디자이너가 Figma 변수를 바꾸면 CI가 CSS 변수로 내보내도록 연결해, 손으로 옮겨 적는 과정을 없앴습니다.",
      },
      {
        type: "image",
        src: "/projects/atlas-design-system/tokens.svg",
        alt: "토큰 계층 구조 다이어그램",
        caption: "원시 값 → 의미 토큰 → 컴포넌트 토큰의 3단 구조",
      },
    ],
  },
  {
    slug: "slow-coffee",
    title: "Slow Coffee",
    summary:
      "로스터리 브랜드의 패키지와 온라인 스토어. 원두 12종을 한 시스템 안에서 구분되게 만들기.",
    year: "2023",
    role: "Brand & Packaging",
    cover: "/projects/slow-coffee/cover.svg",
    accent: ["#14532d", "#84cc16"],
    tags: ["Branding", "Packaging", "E-commerce"],
    meta: [
      { label: "Client", value: "Slow Coffee Roasters" },
      { label: "Year", value: "2023" },
      { label: "Role", value: "브랜드 아이덴티티 · 패키지 · 스토어 UI" },
    ],
    blocks: [
      {
        type: "text",
        body: "원두가 12종인데 매대에서는 다 똑같아 보인다는 게 클라이언트의 고민이었습니다. 색으로 구분하면 12색이 필요하고, 그러면 브랜드가 사라집니다.",
      },
      {
        type: "text",
        body: "색 대신 라벨의 인쇄 패턴을 변수로 썼습니다. 산미가 높을수록 선이 촘촘해지고, 로스팅이 깊을수록 잉크가 진해집니다. 고르는 사람이 이름을 몰라도 취향으로 집을 수 있게 했습니다.",
      },
      {
        type: "image",
        src: "/projects/slow-coffee/packaging.svg",
        alt: "원두 패키지 12종 라인업",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
