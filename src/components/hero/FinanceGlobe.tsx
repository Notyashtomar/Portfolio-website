"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  Suspense,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { usePerfFlags } from "@/components/providers/Providers";

const R = 2;

const TERMS = [
  { label: "EBITDA", color: "#4f8cff" },
  { label: "ROI", color: "#8b5cf6" },
  { label: "IRR", color: "#4f8cff" },
  { label: "NPV", color: "#ff3d9a" },
  { label: "CAGR", color: "#8b5cf6" },
  { label: "Sharpe", color: "#4f8cff" },
  { label: "P&L", color: "#ff3d9a" },
  { label: "MIS", color: "#4f8cff" },
  { label: "Alpha", color: "#8b5cf6" },
  { label: "Beta", color: "#4f8cff" },
  { label: "Volatility", color: "#ff3d9a" },
  { label: "ARIMA", color: "#8b5cf6" },
  { label: "Python", color: "#4f8cff" },
  { label: "SQL", color: "#8b5cf6" },
  { label: "Forecasting", color: "#4f8cff" },
  { label: "VaR", color: "#ff3d9a" },
  { label: "Risk Mgmt", color: "#8b5cf6" },
  { label: "Regression", color: "#4f8cff" },
];

/** Evenly distributes n points on a sphere using Fibonacci lattice */
function fibSphere(n: number, radius: number): [number, number, number][] {
  const golden = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: n }, (_, i) => {
    const theta = (2 * Math.PI * i) / golden;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    ] as [number, number, number];
  });
}

function GlobeWireframe() {
  const geo = useMemo(() => {
    const buf = new THREE.BufferGeometry();
    const verts: number[] = [];
    const SEG = 64;

    // Latitude rings
    const cosPhi = [0.82, 0.45, 0, -0.45, -0.82];
    for (const cp of cosPhi) {
      const sp = Math.sqrt(1 - cp * cp);
      for (let j = 0; j < SEG; j++) {
        const t0 = (j / SEG) * Math.PI * 2;
        const t1 = ((j + 1) / SEG) * Math.PI * 2;
        verts.push(R * sp * Math.cos(t0), R * cp, R * sp * Math.sin(t0));
        verts.push(R * sp * Math.cos(t1), R * cp, R * sp * Math.sin(t1));
      }
    }

    // Longitude arcs
    const lonCount = 14;
    for (let i = 0; i < lonCount; i++) {
      const theta = (i / lonCount) * Math.PI * 2;
      for (let j = 0; j < SEG; j++) {
        const p0 = (j / SEG) * Math.PI;
        const p1 = ((j + 1) / SEG) * Math.PI;
        verts.push(
          R * Math.sin(p0) * Math.cos(theta),
          R * Math.cos(p0),
          R * Math.sin(p0) * Math.sin(theta),
        );
        verts.push(
          R * Math.sin(p1) * Math.cos(theta),
          R * Math.cos(p1),
          R * Math.sin(p1) * Math.sin(theta),
        );
      }
    }

    buf.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return buf;
  }, []);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#4f8cff" transparent opacity={0.16} />
    </lineSegments>
  );
}

function GlobeCore() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((s) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <mesh>
      <sphereGeometry args={[R, 48, 24]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform float uTime;
          void main() {
            float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 3.0);
            float scan = step(0.992, sin(vPos.y * 30.0 + uTime * 0.4) * 0.5 + 0.5);
            vec3 col = mix(vec3(0.005, 0.02, 0.08), vec3(0.15, 0.42, 1.0), fresnel * 0.85);
            col += scan * 0.06 * vec3(0.5, 0.7, 1.0);
            gl_FragColor = vec4(col, 0.15 + fresnel * 0.62);
          }
        `}
      />
    </mesh>
  );
}

function TermLabels() {
  const positions = useMemo(() => fibSphere(TERMS.length, R * 1.25), []);

  return (
    <>
      {TERMS.map((t, i) => (
        <Html key={t.label} position={positions[i]} center occlude={false}>
          <span
            style={{
              color: t.color,
              fontFamily: "'Cabinet Grotesk', 'Satoshi', monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textShadow: `0 0 14px ${t.color}99`,
              pointerEvents: "none",
              userSelect: "none",
              opacity: 0.8,
            }}
          >
            {t.label}
          </span>
        </Html>
      ))}
    </>
  );
}

function Ring({
  radius,
  tilt,
  speed,
  color,
  opacity,
}: {
  radius: number;
  tilt: number;
  speed: number;
  color: string;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 2, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.0 + Math.random() * 2.8;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph);
    }
    return arr;
  }, [count]);

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#9ec5ff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlobeGroup({
  mouse,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.09;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      mouse.current.y * 0.15,
      0.04,
    );
  });

  return (
    <group ref={ref}>
      <GlobeCore />
      <GlobeWireframe />
      <TermLabels />
      <Ring radius={R * 1.2} tilt={Math.PI / 6} speed={0.14} color="#4f8cff" opacity={0.4} />
      <Ring radius={R * 1.38} tilt={-Math.PI / 4} speed={-0.09} color="#8b5cf6" opacity={0.28} />
      <Ring radius={R * 1.52} tilt={Math.PI / 2.5} speed={0.06} color="#4f8cff" opacity={0.15} />
    </group>
  );
}

function Scene({
  mouse,
  tier,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  tier: string;
}) {
  const isHigh = tier === "high";
  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[5, 4, 3]} intensity={24} color="#4f8cff" />
      <pointLight position={[-4, -2, 2]} intensity={14} color="#8b5cf6" />
      <pointLight position={[0, -4, 0]} intensity={8} color="#ff3d9a" />
      <GlobeGroup mouse={mouse} />
      <Particles count={isHigh ? 90 : 55} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={isHigh ? 2.2 : 1.4}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.92}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export function FinanceGlobe() {
  const mouse = useRef({ x: 0, y: 0 });
  const { tier, dpr, enableWebGL } = usePerfFlags();

  if (!enableWebGL) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <div
          className="h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,140,255,0.28) 0%, rgba(139,92,246,0.15) 45%, transparent 70%)",
            boxShadow: "0 0 80px rgba(79,140,255,0.3)",
          }}
        />
      </div>
    );
  }

  return (
    <div
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
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 6.5], fov: 40 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} tier={tier} />
        </Suspense>
      </Canvas>
    </div>
  );
}
