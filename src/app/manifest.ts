import type { MetadataRoute } from "next";

/**
 * 손에 쥔 화면을 홈 화면에 추가했을 때 주소창 없이 뜨게 합니다.
 *
 * 브라우저 주소창은 페이지 권한 밖이라 CSS·JS 로는 지울 수 없습니다.
 * 홈 화면에 추가해 여는 길만이 전체 화면으로 뜨는 유일한 방법입니다.
 *
 * start_url 은 일부러 두지 않습니다. 적어 두면 어느 화면에서 추가하든
 * 그 자리로만 열려서, 목업 화면 각각을 따로 담아 둘 수 없습니다.
 */
/* 정적 내보내기라 이 길도 미리 구워 둡니다. */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "What We Already Know",
    short_name: "Portfolio",
    description:
      "사람들이 이미 이해하고 있는 행동과 감각을 디지털 브랜드 경험으로 번역합니다.",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fafaf8",
    theme_color: "#fafaf8",
  };
}
