import type { TimelineFrame } from "../types";

export function buildTimelineFromSections(
  sections: NodeListOf<HTMLElement>,
): TimelineFrame[] {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) {
    return [];
  }

  const timeline: TimelineFrame[] = [];

  sections.forEach((section, index) => {
    let targetScrollY =
      section.offsetTop + section.offsetHeight / 2 - window.innerHeight / 2;

    targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));

    const progress = targetScrollY / maxScroll;
    const align = Number(section.dataset.align);
    const radF = Number(section.dataset.radf);

    if (index > 0) {
      const previousProgress = timeline[timeline.length - 1].scroll;

      timeline.push({
        scroll: (previousProgress + progress) / 2,
        align: 0,
        radF: 0.34,
      });
    }

    timeline.push({ scroll: progress, align, radF });
  });

  return timeline.sort((a, b) => a.scroll - b.scroll);
}

export function getScrollProgress() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(1, scrollY / maxScroll));
}

export function smoothstep(progress: number) {
  return progress * progress * (3 - 2 * progress);
}

export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}
