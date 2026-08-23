# Portfolio

Next.js(App Router) + TypeScript + Tailwind CSS v4.
GitHub Pages에 정적 사이트로 배포합니다.

## 개발

```bash
npm run dev     # http://localhost:3000
npm run build   # out/ 에 정적 파일 생성
npm run lint
```

## 현재 상태

레이아웃과 콘텐츠는 비어 있습니다. 남아 있는 것은 빌드·배포 설정뿐입니다.

- `next.config.ts` — 정적 내보내기(`output: "export"`), basePath, 이미지 최적화 비활성화
- `.github/workflows/deploy.yml` — main push 시 자동 빌드·배포
- `src/app/layout.tsx` — Geist 폰트 연결만 된 루트 레이아웃
- `src/app/globals.css` — Tailwind import와 폰트 변수만

## GitHub Pages 배포

1. GitHub에 저장소를 만들고 push 합니다.

   ```bash
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

2. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 바꿉니다.
3. `main` 에 push 하면 워크플로가 빌드해서 배포합니다.

### basePath 주의

프로젝트 저장소(`github.com/<user>/<repo>`)로 배포하면 사이트가 `/<repo>/` 하위에 뜹니다.
워크플로가 저장소 이름을 읽어 `NEXT_PUBLIC_BASE_PATH` 를 자동으로 넣어 줍니다.
저장소 이름이 `<username>.github.io` 면 루트로 배포되고 basePath는 비워집니다.

로컬에서 하위 경로 상태를 확인하려면:

```bash
NEXT_PUBLIC_BASE_PATH=/<repo> npm run build
```

### 정적 배포라 주의할 점

- 이미지 최적화 서버가 없으므로(`images.unoptimized`) 이미지는 미리 리사이즈·압축해서 넣으세요.
- 서버 런타임이 없어 API 라우트, 서버 액션, 미들웨어는 쓸 수 없습니다.
- CSS `background-image`, `<video>` 등 Next가 경로를 자동으로 붙여 주지 않는 곳에는
  `process.env.NEXT_PUBLIC_BASE_PATH` 를 직접 붙여야 합니다.
