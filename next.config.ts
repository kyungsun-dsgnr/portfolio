import type { NextConfig } from "next";

// GitHub Pages는 정적 파일만 서빙하므로 정적 내보내기(export) 모드로 빌드합니다.
// 사용자/조직 페이지(`<username>.github.io`)가 아니라 프로젝트 저장소로 배포할 경우,
// 사이트가 `/<repo-name>` 하위 경로에 뜨기 때문에 basePath가 필요합니다.
// 배포 워크플로에서 NEXT_PUBLIC_BASE_PATH를 넣어 줍니다.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // 홈 디렉터리에 있는 package-lock.json을 워크스페이스 루트로 오인하지 않게 고정합니다.
  turbopack: { root: import.meta.dirname },
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // 정적 내보내기에서는 Next.js 이미지 최적화 서버를 쓸 수 없습니다.
    unoptimized: true,
  },
};

export default nextConfig;
