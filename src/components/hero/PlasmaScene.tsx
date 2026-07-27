"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { usePerfFlags } from "@/components/providers/Providers";

function PlasmaOrb({
  mouse,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const target = useMemo(() => new THREE.Vector2(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mat.current) {
      mat.current.uniforms.uTime.value = t;
      target.set(mouse.current.x, mouse.current.y);
      mat.current.uniforms.uMouse.value.lerp(target, 0.06);
    }
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.12;
      mesh.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      const pulse = 1 + Math.sin(t * 1.4) * 0.04;
      mesh.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.6, 32]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform float uTime;
          uniform vec2 uMouse;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec3 p = position;
            float wave = sin(p.x * 3.0 + uTime) * cos(p.y * 3.0 - uTime * 0.8) * 0.07;
            p += normal * wave;
            p += vec3(uMouse.x, uMouse.y, 0.0) * 0.1;
            vPos = p;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform float uTime;
          void main() {
            float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);
            float bands = sin(vPos.y * 8.0 + uTime * 2.0) * 0.5 + 0.5;
            vec3 col = mix(vec3(0.2, 0.5, 1.0), vec3(0.5, 0.2, 0.95), bands);
            col = mix(col, vec3(1.0, 0.25, 0.6), fresnel * 0.55);
            gl_FragColor = vec4(col, 0.35 + fresnel * 0.65);
          }
        `}
      />
    </mesh>
  );
}

function OrbitParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#9ec5ff"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig({
  mouse,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.08) * 0.35 + mouse.current.x * 0.25;
    camera.position.y = Math.cos(t * 0.07) * 0.2 + mouse.current.y * 0.2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({
  mouse,
  particleCount,
  bloomIntensity,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  particleCount: number;
  bloomIntensity: number;
}) {
  return (
    <>
      <color attach="background" args={["#030303"]} />
      <fog attach="fog" args={["#030303", 5, 16]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 2, 2]} intensity={16} color="#4f8cff" />
      <pointLight position={[-3, -1, 1]} intensity={10} color="#8b5cf6" />
      <CameraRig mouse={mouse} />
      <PlasmaOrb mouse={mouse} />
      <OrbitParticles count={particleCount} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export function PlasmaScene() {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const { performanceMode, tier, dpr, enableWebGL } = usePerfFlags();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!enableWebGL) {
    return (
      <div className="hero-fallback-glow absolute inset-0" aria-hidden />
    );
  }

  const particleCount = performanceMode ? 40 : tier === "high" ? 100 : 70;
  const bloomIntensity = performanceMode ? 0.9 : tier === "high" ? 1.6 : 1.2;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouse.current = {
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
        };
      }}
    >
      <Canvas
        frameloop={active ? "always" : "demand"}
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 5.2], fov: 40 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        <Suspense fallback={null}>
          <Scene
            mouse={mouse}
            particleCount={particleCount}
            bloomIntensity={bloomIntensity}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
