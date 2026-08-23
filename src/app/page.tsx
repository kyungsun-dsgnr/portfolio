export default function Home() {
  return (
    <main className="page-grid">
      <h1 className="type-display col-span-5 row-span-2">
        you Already Know
        <br />
        which way to turn
      </h1>

      <div className="col-span-3 row-span-2 flex flex-col justify-center gap-4">
        <h2 className="type-title">What We Already Know</h2>
        <div className="type-body text-[#191919]/90">
          <p>
            사람들이 이미 이해하고 있는 행동과 감각을 디지털 브랜드
            <br />
            경험으로 번역합니다.
          </p>
          <p className="mt-[1.1em]">노브를 이용해 조명을 켜보세요.</p>
        </div>
      </div>

      {/* 메인 비주얼 자리 */}
      <div className="col-span-5 row-span-4 bg-[var(--placeholder)]" />

      {/* 노브 자리 */}
      <div className="col-span-3 row-span-4 overflow-hidden bg-[var(--placeholder)]" />
    </main>
  );
}
