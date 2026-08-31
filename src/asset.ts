/**
 * 판에 실리는 파일의 주소.
 *
 * 저장소 하위(`/<repo>/`)에 배포하면 자산이 그 아래에 놓입니다.
 * `next/image` 는 로더가 접두어를 붙여 주지만, 맨 `<img>` 나 SVG `<image>` 는
 * 아무도 손대지 않아 그대로 나갑니다. 그런 자리에서 이 함수를 씁니다.
 */
export function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  /* 바깥 주소나 데이터 URI 는 손대지 않습니다. */
  return path.startsWith("/") ? `${base}${path}` : path;
}
