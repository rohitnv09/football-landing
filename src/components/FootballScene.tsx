import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useCallback, useEffect, useRef, type RefObject } from "react";
import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  type Object3D,
} from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { TimelineFrame } from "../types";
import {
  buildTimelineFromSections,
  getScrollProgress,
  lerp,
  smoothstep,
} from "../utils/timeline";

const MODEL_URL = "/models/football.glb";
const BASE_CAMERA_RADIUS = 14;
const MODEL_SCALE = 1.6;
const MOBILE_BREAKPOINT = 760;
const MOBILE_CAMERA_FOV = 60;
const DESKTOP_CAMERA_FOV = 42;

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

type SharedSceneState = {
  autoRotateThetaRef: RefObject<number>;
  cameraBaseRef: RefObject<CameraBase>;
  currentScrollRef: RefObject<number>;
  dragRef: RefObject<DragState>;
  modelStageRef: RefObject<HTMLDivElement | null>;
  targetScrollRef: RefObject<number>;
  timelineRef: RefObject<TimelineFrame[]>;
};

type FootballModelProps = {
  onReady: () => void;
};

function getSceneViewportSettings() {
  const aspect = window.innerWidth / window.innerHeight;
  const isCompactPortrait =
    window.innerWidth <= MOBILE_BREAKPOINT || aspect < 0.82;

  return {
    cameraFov: isCompactPortrait ? MOBILE_CAMERA_FOV : DESKTOP_CAMERA_FOV,
    radiusMultiplier: isCompactPortrait ? 3.8 : 1,
    shiftVW: isCompactPortrait ? 12 : 25,
  };
}

function tintMaterial(material: MeshStandardMaterial) {
  material.roughness = Math.max(material.roughness, 0.56);
  material.metalness = Math.min(material.metalness, 0.08);
  material.needsUpdate = true;
}

function prepareModelObject(object: Object3D) {
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    child.castShadow = true;
    child.receiveShadow = true;

    if (Array.isArray(child.material)) {
      child.material.forEach((material) => {
        if (material instanceof MeshStandardMaterial) {
          tintMaterial(material);
        }
      });
      return;
    }

    if (child.material instanceof MeshStandardMaterial) {
      tintMaterial(child.material);
    }
  });
}

function FootballModel({ onReady }: FootballModelProps) {
  const gltf = useLoader(GLTFLoader, MODEL_URL) as GLTF;
  const modelRef = useRef<Group>(null);

  useEffect(() => {
    const model = modelRef.current;

    if (!model) return;

    const box = new Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = MODEL_SCALE / maxDimension;

    prepareModelObject(gltf.scene);
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    onReady();
  }, [gltf.scene, onReady]);

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function SceneRig({
  autoRotateThetaRef,
  cameraBaseRef,
  currentScrollRef,
  dragRef,
  modelStageRef,
  targetScrollRef,
  timelineRef,
}: SharedSceneState) {
  const target = useRef(new Vector3());

  useFrame(({ camera }, delta) => {
    const frames = timelineRef.current;

    if (frames.length === 0) return;

    currentScrollRef.current +=
      (targetScrollRef.current - currentScrollRef.current) * 0.2;

    let startFrame = frames[0];
    let endFrame = frames[frames.length - 1];
    let localProgress = 0;

    for (let index = 0; index < frames.length - 1; index += 1) {
      if (
        currentScrollRef.current >= frames[index].scroll &&
        currentScrollRef.current <= frames[index + 1].scroll
      ) {
        startFrame = frames[index];
        endFrame = frames[index + 1];

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
    const dragState = dragRef.current;
    const sceneSettings = getSceneViewportSettings();

    if (!dragState.active && delta < 0.1) {
      autoRotateThetaRef.current += delta * 0.8;
    }

    if ("fov" in camera && camera.fov !== sceneSettings.cameraFov) {
      camera.fov = sceneSettings.cameraFov;
      camera.updateProjectionMatrix();
    }

    const radius = base.radius * radF * sceneSettings.radiusMultiplier;
    const phi = base.phi + dragState.phi;
    const theta = base.theta + autoRotateThetaRef.current + dragState.theta;
    const camX = base.target[0] + radius * Math.cos(phi) * Math.sin(theta);
    const camY = base.target[1] + radius * Math.sin(phi);
    const camZ = base.target[2] + radius * Math.cos(phi) * Math.cos(theta);

    camera.position.set(camX, camY, camZ);
    target.current.set(base.target[0], base.target[1], base.target[2]);
    camera.lookAt(target.current);

    if (modelStageRef.current) {
      modelStageRef.current.style.transform = `translateX(${
        align * sceneSettings.shiftVW
      }vw)`;
    }
  });

  return null;
}

export function FootballScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const modelStageRef = useRef<HTMLDivElement>(null);
  const cameraBaseRef = useRef<CameraBase>({
    radius: BASE_CAMERA_RADIUS,
    target: [0, 0, 0],
    theta: 0.42,
    phi: 0.18,
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

  const handleModelReady = useCallback(() => {
    timelineRef.current = buildTimelineFromSections(
      document.querySelectorAll<HTMLElement>(".scroll-section"),
    );
    targetScrollRef.current = getScrollProgress();
    currentScrollRef.current = targetScrollRef.current;

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
  }, []);

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

  return (
    <>
      <div id="loader" ref={loaderRef}>
        INITIALIZING...
      </div>
      <div id="model-container" ref={containerRef}>
        <div className="model-stage" ref={modelStageRef}>
          <Canvas
            camera={{
              fov: DESKTOP_CAMERA_FOV,
              near: 0.01,
              far: 100,
              position: [0, 2, 4],
            }}
            className="model-canvas"
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            shadows
          >
            <ambientLight intensity={1.1} />
            <directionalLight intensity={2.2} position={[4, 5, 6]} />
            <directionalLight intensity={0.8} position={[-5, -2, -4]} />
            <pointLight color="#00ff87" intensity={2.6} position={[0, 2, 3]} />
            <Suspense fallback={null}>
              <FootballModel onReady={handleModelReady} />
            </Suspense>
            <SceneRig
              autoRotateThetaRef={autoRotateThetaRef}
              cameraBaseRef={cameraBaseRef}
              currentScrollRef={currentScrollRef}
              dragRef={dragRef}
              modelStageRef={modelStageRef}
              targetScrollRef={targetScrollRef}
              timelineRef={timelineRef}
            />
          </Canvas>
        </div>
      </div>
    </>
  );
}
