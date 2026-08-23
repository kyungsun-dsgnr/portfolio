const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * public/ 안의 파일 경로를 basePath가 붙은 실제 URL로 바꿔 줍니다.
 * <Link>나 next/image의 src와 달리 CSS background-image, <video>, og:image 등
 * Next가 자동으로 basePath를 붙여 주지 않는 곳에서 사용하세요.
 */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
