"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  Html,
  PresentationControls,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { ScreenUI } from "./ScreenUI";

type SceneProps = {
  progress: number;
  entering: boolean;
  mouse: MutableRefObject<{ x: number; y: number }>;
  lite: boolean;
};

function MacBook({
  progress,
  entering,
  mouse,
}: {
  progress: number;
  entering: boolean;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Group>(null);
  const edgeMat = useRef<THREE.MeshStandardMaterial>(null);
  const target = useMemo(() => new THREE.Vector2(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;

    target.set(mouse.current.x * 0.35, mouse.current.y * 0.2);
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      target.x + Math.sin(t * 0.25) * 0.08,
      0.05,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -0.18 + target.y + Math.sin(t * 0.35) * 0.04,
      0.05,
    );

    if (screen.current) {
      const open = entering ? 0.08 : 0.42 + Math.sin(t * 0.4) * 0.01;
      screen.current.rotation.x = THREE.MathUtils.lerp(
        screen.current.rotation.x,
        -Math.PI * open,
        0.06,
      );
    }

    if (edgeMat.current) {
      edgeMat.current.emissiveIntensity = 0.35 + progress / 180 + Math.sin(t * 2) * 0.08;
    }

    if (entering) {
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 1.6, 0.045);
      group.current.scale.setScalar(
        THREE.MathUtils.lerp(group.current.scale.x, 2.4, 0.045),
      );
    }
  });

  const bodyColor = "#1a1b1f";
  const metal = "#2a2c32";

  return (
    <group ref={group} position={[0, -0.15, 0]} scale={1.05}>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.4, 0.08, 2.25]} />
        <meshStandardMaterial color={bodyColor} metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.05, 0.15]}>
        <boxGeometry args={[2.1, 0.01, 1.15]} />
        <meshStandardMaterial color="#111214" metalness={0.4} roughness={0.55} />
      </mesh>
      {/* Trackpad */}
      <mesh position={[0, 0.055, 0.55]}>
        <boxGeometry args={[1.15, 0.01, 0.7]} />
        <meshStandardMaterial color="#16171b" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Glow rim under base */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 2.05]} />
        <meshBasicMaterial color="#4f8cff" transparent opacity={0.08 + progress / 900} />
      </mesh>

      {/* Screen assembly */}
      <group ref={screen} position={[0, 0.04, -1.08]}>
        <mesh castShadow position={[0, 1.05, 0]}>
          <boxGeometry args={[3.4, 2.15, 0.07]} />
          <meshStandardMaterial
            ref={edgeMat}
            color={metal}
            metalness={0.9}
            roughness={0.22}
            emissive="#4f8cff"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Bezel */}
        <mesh position={[0, 1.05, 0.04]}>
          <boxGeometry args={[3.15, 1.95, 0.02]} />
          <meshStandardMaterial color="#050505" metalness={0.2} roughness={0.7} />
        </mesh>

        {/* Display */}
        <mesh position={[0, 1.05, 0.055]}>
          <planeGeometry args={[2.95, 1.78]} />
          <meshBasicMaterial color="#050508" />
        </mesh>

        <Html
          transform
          occlude="blending"
          position={[0, 1.05, 0.07]}
          distanceFactor={2.55}
          style={{
            width: 360,
            height: 220,
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: `0 0 ${20 + progress / 4}px rgba(79,140,255,${0.15 + progress / 400})`,
          }}
        >
          <ScreenUI progress={progress} />
        </Html>

        {/* Screen glass shine */}
        <mesh position={[0, 1.05, 0.08]} rotation={[0, 0, 0]}>
          <planeGeometry args={[2.95, 1.78]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.04}
            roughness={0.1}
            metalness={0}
            clearcoat={1}
          />
        </mesh>
      </group>
    </group>
  );
}

function CameraRig({ entering }: { entering: boolean }) {
  const { camera } = useThree();
  const start = useRef(true);

  useEffect(() => {
    camera.position.set(0, 1.35, 5.2);
    camera.lookAt(0, 0.5, 0);
  }, [camera]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (entering) {
      camera.position.lerp(new THREE.Vector3(0, 0.95, 1.15), 0.045);
      camera.lookAt(0, 0.85, 0);
      return;
    }
    if (start.current) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 4.6, 0.03);
      if (Math.abs(camera.position.z - 4.6) < 0.05) start.current = false;
    }
    camera.position.x = Math.sin(t * 0.18) * 0.35;
    camera.position.y = 1.25 + Math.sin(t * 0.22) * 0.12;
    camera.lookAt(0, 0.45, 0);
  });

  return null;
}

function SceneInner({ progress, entering, mouse, lite }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#030303"]} />
      <ambientLight intensity={0.35} />
      <spotLight
        position={[4, 6, 4]}
        angle={0.45}
        penumbra={0.8}
        intensity={entering ? 3.2 : 1.8}
        color="#8eb6ff"
        castShadow={!lite}
      />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[2, -1, 3]} intensity={0.45} color="#4f8cff" />

      <CameraRig entering={entering} />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
        <PresentationControls
          global={false}
          snap
          speed={0.8}
          zoom={1}
          polar={[-0.15, 0.2]}
          azimuth={[-0.35, 0.35]}
        >
          <MacBook progress={progress} entering={entering} mouse={mouse} />
        </PresentationControls>
      </Float>

      {!lite ? (
        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.45}
          scale={8}
          blur={2.8}
          far={4}
        />
      ) : null}

      {/* Soft fill light instead of HDR environment for reliability */}
      <hemisphereLight args={["#8eb6ff", "#050508", 0.35]} />

      {!lite ? (
        <EffectComposer>
          <Bloom
            intensity={entering ? 1.4 : 0.55}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </>
  );
}

type Props = {
  progress: number;
  entering: boolean;
  mouse: MutableRefObject<{ x: number; y: number }>;
  lite: boolean;
};

export function IntroMacBook({ progress, entering, mouse, lite }: Props) {
  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        dpr={lite ? 1 : [1, 1.5]}
        camera={{ position: [0, 1.35, 5.2], fov: 42, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows={!lite}
      >
        <Suspense fallback={null}>
          <SceneInner
            progress={progress}
            entering={entering}
            mouse={mouse}
            lite={lite}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
