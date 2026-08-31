import type { NextConfig } from "next";

// GitHub Pages는 정적 파일만 서빙하므로 정적 내보내기(export) 모드로 빌드합니다.
// 사용자/조직 페이지(`<username>.github.io`)가 아니라 프로젝트 저장소로 배포할 경우,
// 사이트가 `/<repo-name>` 하위 경로에 뜨기 때문에 basePath가 필요합니다.
// 배포 워크플로에서 NEXT_PUBLIC_BASE_PATH를 넣어 줍니다.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // 홈 디렉터리에 있는 package-lock.json을 워크스페이스 루트로 오인하지 않게 고정합니다.
  turbopack: { root: import.meta.dirname },
  // 같은 망의 휴대폰에서 열어 볼 수 있게 사설망 주소를 허용합니다.
  // 이 값이 없으면 개발 서버가 다른 origin 의 /_next 요청을 403 으로 막습니다.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*"],
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // 정적 내보내기에서는 Next.js 이미지 최적화 서버를 쓸 수 없습니다.
    // 기본 로더는 경로를 그대로 돌려주며 basePath 를 붙이지 않아,
    // 저장소 하위에 배포하면 이미지가 전부 404 가 됩니다. 로더에서 붙입니다.
    loader: "custom",
    loaderFile: "./src/image-loader.ts",
  },
};

export default nextConfig;
