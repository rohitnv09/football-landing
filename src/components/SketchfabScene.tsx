import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type { SketchfabApi, TimelineFrame } from "../types";
import { loadScript } from "../utils/loadScript";
import {
  buildTimelineFromSections,
  getScrollProgress,
  lerp,
  smoothstep,
} from "../utils/timeline";

const SKETCHFAB_SCRIPT =
  "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
const SKETCHFAB_UID = "72a3f17f6d0245ef9b047ff813c6f647";

type CameraBase = {
  radius: number;
  target: [number, number, number];
  theta: number;
  phi: number;
};

type DragState = {
  active: boolean;
  previousX: number;
  previousY: number;
  theta: number;
  phi: number;
};

export function SketchfabScene() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SketchfabApi | null>(null);
  const cameraBaseRef = useRef<CameraBase>({
    radius: 10,
    target: [0, 0, 0],
    theta: 0,
    phi: 0,
  });
  const timelineRef = useRef<TimelineFrame[]>([]);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const autoRotateThetaRef = useRef(0);
  const dragRef = useRef<DragState>({
    active: false,
    previousX: 0,
    previousY: 0,
    theta: 0,
    phi: 0,
  });
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const rebuildTimeline = () => {
      timelineRef.current = buildTimelineFromSections(
        document.querySelectorAll<HTMLElement>(".scroll-section"),
      );
      targetScrollRef.current = getScrollProgress();
    };

    const updateScrollTarget = () => {
      targetScrollRef.current = getScrollProgress();
    };

    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", rebuildTimeline);

    rebuildTimeline();

    return () => {
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", rebuildTimeline);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const startDrag = (x: number, y: number) => {
      dragRef.current.active = true;
      dragRef.current.previousX = x;
      dragRef.current.previousY = y;
      document.body.style.cursor = "grabbing";
    };

    const moveDrag = (x: number, y: number) => {
      if (!dragRef.current.active) return;

      const deltaX = x - dragRef.current.previousX;
      const deltaY = y - dragRef.current.previousY;

      dragRef.current.theta -= deltaX * 0.006;
      dragRef.current.phi = Math.max(
        -1.5,
        Math.min(1.5, dragRef.current.phi + deltaY * 0.006),
      );
      dragRef.current.previousX = x;
      dragRef.current.previousY = y;
    };

    const stopDrag = () => {
      dragRef.current.active = false;
      document.body.style.cursor = "default";
    };

    const onMouseDown = (event: MouseEvent) => {
      startDrag(event.clientX, event.clientY);
    };
    const onMouseMove = (event: MouseEvent) => {
      moveDrag(event.clientX, event.clientY);
    };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) startDrag(touch.clientX, touch.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) moveDrag(touch.clientX, touch.clientY);
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stopDrag);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
      document.body.style.cursor = "default";
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let lastTime = performance.now();

    const tick = () => {
      const api = apiRef.current;
      const iframe = iframeRef.current;
      const timeline = timelineRef.current;

      if (!api || !iframe || timeline.length === 0) return;

      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;

      currentScrollRef.current +=
        (targetScrollRef.current - currentScrollRef.current) * 0.2;

      let startFrame = timeline[0];
      let endFrame = timeline[timeline.length - 1];
      let localProgress = 0;

      for (let index = 0; index < timeline.length - 1; index += 1) {
        if (
          currentScrollRef.current >= timeline[index].scroll &&
          currentScrollRef.current <= timeline[index + 1].scroll
        ) {
          startFrame = timeline[index];
          endFrame = timeline[index + 1];

          const range = endFrame.scroll - startFrame.scroll;
          localProgress = smoothstep(
            range === 0
              ? 0
              : (currentScrollRef.current - startFrame.scroll) / range,
          );
          break;
        }
      }

      const align = lerp(startFrame.align, endFrame.align, localProgress);
      const radF = lerp(startFrame.radF, endFrame.radF, localProgress);
      const base = cameraBaseRef.current;
      const drag = dragRef.current;

      if (!drag.active && delta < 100) {
        autoRotateThetaRef.current += delta * 0.0008;
      }

      const currentRadius = base.radius * radF;
      const currentPhi = base.phi + drag.phi;
      const currentTheta = base.theta + autoRotateThetaRef.current + drag.theta;
      const camLocalX =
        currentRadius * Math.cos(currentPhi) * Math.sin(currentTheta);
      const camLocalY =
        currentRadius * Math.cos(currentPhi) * Math.cos(currentTheta);
      const camLocalZ = currentRadius * Math.sin(currentPhi);
      const camWorldX = base.target[0] + camLocalX;
      const camWorldY = base.target[1] + camLocalY;
      const camWorldZ = base.target[2] + camLocalZ;
      const aspect = window.innerWidth / window.innerHeight;
      const shiftVW = aspect < 1 ? 35 : 25;

      api.setCameraLookAt(
        [camWorldX, camWorldY, camWorldZ],
        base.target,
        0,
      );
      iframe.style.transform = `translateX(${align * shiftVW}vw)`;
    };

    const boot = async () => {
      const iframe = iframeRef.current;

      if (!iframe) return;

      try {
        await loadScript(SKETCHFAB_SCRIPT);

        if (cancelled) return;

        const client = new window.Sketchfab("1.12.1", iframe);

        client.init(SKETCHFAB_UID, {
          success: (api) => {
            apiRef.current = api;
            api.start();
            api.addEventListener("viewerready", () => {
              api.getCameraLookAt((error, camera) => {
                if (error) {
                  setLoadError(true);
                  return;
                }

                const [camX, camY, camZ] = camera.position;
                const [targetX, targetY, targetZ] = camera.target;
                const dx = camX - targetX;
                const dy = camY - targetY;
                const dz = camZ - targetZ;
                const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);

                cameraBaseRef.current = {
                  radius,
                  target: camera.target,
                  theta: Math.atan2(dx, dy),
                  phi: Math.asin(dz / radius),
                };
                timelineRef.current = buildTimelineFromSections(
                  document.querySelectorAll<HTMLElement>(".scroll-section"),
                );
                targetScrollRef.current = getScrollProgress();
                currentScrollRef.current = targetScrollRef.current;
                lastTime = performance.now();

                if (loaderRef.current) {
                  gsap.to(loaderRef.current, {
                    autoAlpha: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                      if (loaderRef.current) {
                        loaderRef.current.style.display = "none";
                      }
                    },
                  });
                }

                gsap.ticker.add(tick);
              });
            });
          },
          error: () => setLoadError(true),
          autostart: 1,
          transparent: 1,
          ui_theme: "dark",
          ui_watermark: 0,
          ui_infos: 0,
          ui_stop: 0,
          ui_hints: 0,
          ui_help: 0,
          scrollwheel: 0,
        });
      } catch {
        if (!cancelled) setLoadError(true);
      }
    };

    void boot();

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <div id="loader" ref={loaderRef}>
        {loadError ? "MODEL UNAVAILABLE" : "INITIALIZING..."}
      </div>
      <div id="sketchfab-container" ref={containerRef}>
        <iframe
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          id="api-frame"
          ref={iframeRef}
          title="Interactive Kinetic Orb football model"
        />
      </div>
    </>
  );
}
