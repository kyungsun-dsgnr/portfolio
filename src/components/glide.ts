/**
 * 화면 안을 부드럽게 굴립니다.
 * `behavior: "smooth"` 는 브라우저가 속도를 정해 버려 느리게 만들 수 없습니다.
 * 목업 안에서는 손으로 미는 것보다 느긋해야 눈이 따라오므로 직접 그립니다.
 */
export function glide(
  el: HTMLElement,
  to: number,
  ms = 1800,
  axis: "top" | "left" = "top",
) {
  const from = axis === "top" ? el.scrollTop : el.scrollLeft;
  const gap = to - from;
  if (!gap) return () => {};

  const began = performance.now();
  let frame = 0;

  const step = (now: number) => {
    const gone = Math.min(1, (now - began) / ms);
    /* 끝에서 천천히 잦아듭니다. */
    const eased = 1 - Math.pow(1 - gone, 3);
    const at = from + gap * eased;
    el.scrollTo(axis === "top" ? { top: at } : { left: at });
    if (gone < 1) frame = requestAnimationFrame(step);
  };

  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}
