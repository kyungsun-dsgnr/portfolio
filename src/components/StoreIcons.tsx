/** 스토어 화면 목업이 함께 쓰는 아이콘.
    실제 화면의 벡터를 그대로 옮겨 그렸고, 크기는 밖에서 정합니다. */

/** 두 줄에 손잡이가 하나씩 달린 필터 아이콘 */
export function FilterIcon({ size = 21.08 }: { size?: number }) {
  return (
    <svg
      className="store-icon"
      viewBox="0 0 21.08 21.08"
      style={{
        width: `calc(${size} * var(--u))`,
        height: `calc(${size} * var(--u))`,
      }}
      fill="currentColor"
      aria-hidden
    >
      <rect x="3.51" y="6.94" width="14.05" height="1.05" />
      {/* 손잡이 둘은 줄 위에서 1 씩 내려 앉습니다. */}
      <rect x="13.41" y="5.83" width="1.05" height="3.63" />
      <rect x="3.51" y="13.09" width="14.05" height="1.05" />
      <rect x="8.38" y="11.98" width="1.05" height="3.63" />
    </svg>
  );
}

/** 선택 상자 오른쪽의 펼침 표시 */
export function ChevronIcon({ size = 17.57 }: { size?: number }) {
  return (
    <svg
      className="store-icon"
      viewBox="0 0 17.57 17.57"
      style={{
        width: `calc(${size} * var(--u))`,
        height: `calc(${size} * var(--u))`,
      }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.05"
      aria-hidden
    >
      <path d="M5 7.4 8.79 11.1 12.57 7.4" />
    </svg>
  );
}

/** 현재 위치 표시 */
export function LocateIcon({ size = 14.05 }: { size?: number }) {
  return (
    <svg
      className="store-icon"
      viewBox="0 0 14.05 14.05"
      style={{
        width: `calc(${size} * var(--u))`,
        height: `calc(${size} * var(--u))`,
      }}
      fill="currentColor"
      aria-hidden
    >
      {/* 위치를 겨누는 표는 네모보다 원이 눈에 익습니다. */}
      <circle
        cx="7.02"
        cy="7.02"
        r="3.51"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.88"
      />
      <circle cx="7.02" cy="7.02" r="0.88" />
      <rect x="6.58" y="0.88" width="0.88" height="1.81" />
      <rect x="6.58" y="10.72" width="0.88" height="1.81" />
      <rect x="10.71" y="6.59" width="2.46" height="0.88" />
      <rect x="0.88" y="6.59" width="2.46" height="0.88" />
    </svg>
  );
}
