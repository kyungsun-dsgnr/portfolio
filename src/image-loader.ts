import { asset } from "@/asset";

/**
 * 정적 내보내기에서 이미지 경로 앞에 basePath 를 붙입니다.
 *
 * `images.unoptimized` 로 두면 Next 의 기본 로더가 경로를 그대로 돌려주고
 * basePath 를 붙이지 않습니다. 저장소 하위(`/<repo>/`)에 배포하면 이미지가
 * 전부 404 가 되므로, 한 곳에서 접두어를 붙여 줍니다.
 *
 * 최적화 서버가 없으니 크기·품질은 쓰지 않고 경로만 돌려줍니다.
 */
export default function imageLoader({ src }: { src: string }) {
  return asset(src);
}
