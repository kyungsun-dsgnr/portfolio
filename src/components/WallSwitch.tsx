"use client";

import type { KeyboardEvent, MouseEvent } from "react";

type Props = {
  on: boolean;
  onChange: (on: boolean) => void;
  ariaLabel?: string;
};

/**
 * 벽에 붙은 딸각 스위치.
 * 판 하나가 통째로 시소처럼 넘어갑니다. 아래를 누르면 그쪽이 벽으로 들어가고
 * 벌어진 아래 틈으로 빛이 새어 나옵니다 — 그 상태가 켜짐입니다.
 * 위를 누르면 판이 되돌아오며 꺼집니다.
 */
export function WallSwitch({ on, onChange, ariaLabel = "조명" }: Props) {
  /* 누른 자리가 곧 명령입니다. 아래를 누르면 켜지고 위를 누르면 꺼집니다. */
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    onChange(event.clientY - box.top > box.height / 2);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      onChange(true);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      onChange(false);
    }
  }

  return (
    <div className="switch-panel">
      <button
        type="button"
        className="wall-switch"
        role="switch"
        aria-checked={on}
        aria-label={ariaLabel}
        data-on={on || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {/* 앞으로 나온 반쪽이 벽에 드리우는 그림자 */}
        <span className="wall-switch-drop" aria-hidden />
        {/* 그 반쪽 테두리에 서리는 빛 */}
        <span className="wall-switch-glow" aria-hidden />
        {/* 몸통 겉면. 가운데가 골인 V 단면이라 양 끝이 앞으로 섭니다. */}
        <span className="wall-switch-face" aria-hidden />
        {/* 누를 자리를 가리키는 점. 켜지면 이 점에도 불이 듭니다. */}
        <span className="wall-switch-dot" aria-hidden />
      </button>
    </div>
  );
}
