import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";
import { AdditiveBlending, BufferAttribute, BufferGeometry, PointsMaterial } from "three";

function EnergyPoints() {
  const pointsRef = useRef<Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(180 * 3);

    for (let index = 0; index < positions.length; index += 3) {
      const pointIndex = index / 3;
      const angle = pointIndex * 2.399963;
      const radius = 2 + ((pointIndex * 37) % 100) / 12;

      positions[index] = Math.cos(angle) * radius;
      positions[index + 1] = Math.sin(angle) * radius * 0.56;
      positions[index + 2] = -3 - ((pointIndex * 17) % 90) / 30;
    }

    const bufferGeometry = new BufferGeometry();
    bufferGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    return bufferGeometry;
  }, []);

  const material = useMemo(
    () =>
      new PointsMaterial({
        color: "#ffffff",
        size: 0.012,
        transparent: true,
        opacity: 0.16,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.015;
    pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.05;
  });

  return <points ref={pointsRef} args={[geometry, material]} />;
}

export function AmbientCanvas() {
  return (
    <div className="ambient-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]}>
        <EnergyPoints />
      </Canvas>
    </div>
  );
}
