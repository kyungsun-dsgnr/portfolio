# Portfolio

Next.js(App Router) + TypeScript + Tailwind CSS v4로 만든 디자이너 포트폴리오.
GitHub Pages에 정적 사이트로 배포합니다.

## 개발

```bash
npm run dev     # http://localhost:3000
npm run build   # out/ 에 정적 파일 생성
npm run lint
```

## 내 내용으로 바꾸기

| 무엇을 | 어디서 |
| --- | --- |
| 이름, 직함, 소개 문구, 이메일, SNS 링크 | `src/data/site.ts` |
| 프로젝트 목록과 케이스 스터디 본문 | `src/data/projects.ts` |
| 색, 폰트, 여백 등 디자인 토큰 | `src/app/globals.css` 의 `@theme` |

### 프로젝트 추가하기

`src/data/projects.ts` 의 `projects` 배열에 항목을 하나 추가하면
목록 카드와 `/projects/<slug>` 상세 페이지가 자동으로 생깁니다.

본문(`blocks`)은 세 종류를 섞어 쓸 수 있습니다.

- `{ type: "text", body: "..." }` — 문단
- `{ type: "image", src: "/projects/<slug>/foo.jpg", alt: "...", caption: "..." }` — 이미지
- `{ type: "quote", body: "...", source: "..." }` — 인용/성과 강조

### 이미지 교체

`public/projects/<slug>/` 안의 파일이 지금은 자동 생성된 SVG 플레이스홀더입니다.
같은 폴더에 실제 이미지를 넣고 `src/data/projects.ts` 의 경로(확장자 포함)를 바꿔 주세요.

- 카드/상세 상단 대표 이미지(`cover`)는 **16:9**가 가장 잘 맞습니다.
- 정적 내보내기라 Next.js 이미지 최적화 서버를 쓸 수 없으니(`images.unoptimized`),
  업로드 전에 직접 리사이즈·압축하세요. 폭 2000px 이하, 파일당 300KB 안쪽을 권장합니다.
- `cover`를 비워 두면 `accent` 두 색으로 만든 그라디언트가 대신 들어갑니다.

## GitHub Pages 배포

1. GitHub에 저장소를 만들고 push 합니다.

   ```bash
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

2. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 바꿉니다.
3. `main` 에 push 하면 `.github/workflows/deploy.yml` 이 빌드해서 배포합니다.

### basePath 주의

프로젝트 저장소(`github.com/<user>/<repo>`)로 배포하면 사이트가 `/<repo>/` 하위에 뜹니다.
워크플로가 저장소 이름을 읽어 `NEXT_PUBLIC_BASE_PATH` 를 자동으로 넣어 주므로 따로 설정할 게 없습니다.
저장소 이름이 `<username>.github.io` 면 루트로 배포되고 basePath는 비워집니다.

로컬에서 하위 경로 상태를 확인하려면:

```bash
NEXT_PUBLIC_BASE_PATH=/<repo> npm run build
```

CSS `background-image`, `<video>` 등 Next가 경로를 자동으로 붙여 주지 않는 곳에서는
`src/lib/asset.ts` 의 `asset()` 헬퍼를 쓰세요.

## 배포 후 할 일

`src/data/site.ts` 의 `url` 을 실제 주소로 바꾸면 OG 태그가 정확해집니다.
