"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { usePerfFlags } from "@/components/providers/Providers";

const R = 2;
const GLOBE_SCALE = 1.1;
const DRAG_SENSITIVITY = 0.006;
const AUTO_SPIN = 0.0014;
const FIT_RADIUS = R * 1.52 * GLOBE_SCALE * 1.08;
const FIT_MARGIN = 1.05;
const CAMERA_FOV = 34;
const LABEL_RADIUS = R * 1.02;

const TERMS = [
  { label: "EBITDA", color: "#4f8cff", cat: "Ratios", detail: "Tracked EBITDA trends for portfolio companies feeding leadership dashboards." },
  { label: "ROI", color: "#4f8cff", cat: "Ratios", detail: "Automated ROI reporting across fund investments using Excel & Power BI." },
  { label: "IRR", color: "#4f8cff", cat: "Ratios", detail: "Built IRR computation pipelines for deal evaluation and exit modelling." },
  { label: "NPV", color: "#4f8cff", cat: "Ratios", detail: "NPV models for capex planning and multi-year financial projection decks." },
  { label: "CAGR", color: "#4f8cff", cat: "Ratios", detail: "Portfolio CAGR surfaced in executive reports and investor updates." },
  { label: "Sharpe", color: "#4f8cff", cat: "Ratios", detail: "Risk-adjusted return analysis used in fund strategy presentations." },
  { label: "VaR", color: "#4f8cff", cat: "Ratios", detail: "Value at Risk computation for portfolio risk and compliance." },
  { label: "SAP FICO", color: "#22d3ee", cat: "Tools", detail: "ERP-level financial control using SAP FICO for audit-ready reporting." },
  { label: "DCF Model", color: "#22d3ee", cat: "Tools", detail: "Discounted Cash Flow modeling for intrinsic equity value projections." },
  { label: "Valuation", color: "#22d3ee", cat: "Tools", detail: "Business valuation via DCF, EV/EBITDA, and comparable-company analysis." },
  { label: "LBO Model", color: "#22d3ee", cat: "Tools", detail: "Leveraged Buyout modeling with debt waterfalls and IRR sensitivity." },
  { label: "M&A", color: "#22d3ee", cat: "Tools", detail: "Merger & acquisition analytics: synergy mapping and deal-structure modelling." },
  { label: "P&L", color: "#22d3ee", cat: "Tools", detail: "Automated P&L dashboards cutting monthly close time by 35%." },
  { label: "MIS", color: "#22d3ee", cat: "Tools", detail: "End-to-end MIS pipeline serving leadership teams." },
  { label: "Alpha", color: "#ff3d9a", cat: "Analytics", detail: "Alpha attribution analysis for fund strategies via Python & Excel." },
  { label: "Beta", color: "#ff3d9a", cat: "Analytics", detail: "Beta-adjusted risk analysis in investor reporting workflows." },
  { label: "Volatility", color: "#ff3d9a", cat: "Analytics", detail: "Rolling volatility models for risk management and compliance." },
  { label: "ARIMA", color: "#ff3d9a", cat: "Analytics", detail: "ARIMA time-series models for revenue and expense forecasting." },
  { label: "Regression", color: "#ff3d9a", cat: "Analytics", detail: "Multiple regression for cost-driver and performance attribution." },
  { label: "Forecasting", color: "#ff3d9a", cat: "Analytics", detail: "Multi-horizon forecast models for executive strategy sessions." },
  { label: "Risk Mgmt", color: "#ff3d9a", cat: "Analytics", detail: "Integrated risk frameworks covering market, credit, and operational risk." },
  { label: "Python", color: "#8b5cf6", cat: "Eng", detail: "Python scripts for data pipelines, automation, and ML forecasting." },
  { label: "SQL", color: "#8b5cf6", cat: "Eng", detail: "Advanced SQL cutting data extraction time by 40%." },
] as const;

const CAT_COLORS: Record<string, string> = {
  Ratios: "#4f8cff",
  Tools: "#22d3ee",
  Analytics: "#ff3d9a",
  Eng: "#8b5cf6",
};
const CAT_LABELS: Record<string, string> = {
  Ratios: "Finance Ratios",
  Tools: "Finance Tools",
  Analytics: "Analytics",
  Eng: "Engineering",
};

type Term = (typeof TERMS)[number];

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
    const lonCount = 14;
    for (let i = 0; i < lonCount; i++) {
      const theta = (i / lonCount) * Math.PI * 2;
      for (let j = 0; j < SEG; j++) {
        const p0 = (j / SEG) * Math.PI;
        const p1 = ((j + 1) / SEG) * Math.PI;
        verts.push(R * Math.sin(p0) * Math.cos(theta), R * Math.cos(p0), R * Math.sin(p0) * Math.sin(theta));
        verts.push(R * Math.sin(p1) * Math.cos(theta), R * Math.cos(p1), R * Math.sin(p1) * Math.sin(theta));
      }
    }
    buf.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return buf;
  }, []);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#4f8cff" transparent opacity={0.18} />
    </lineSegments>
  );
}

function GlobeCore({ highlighted }: { highlighted: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uHighlight: { value: 0 } }), []);

  useFrame((s) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
    const target = highlighted ? 1 : 0;
    matRef.current.uniforms.uHighlight.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uHighlight.value,
      target,
      0.08,
    );
  });

  return (
    <mesh>
      <sphereGeometry args={[R, 48, 48]} />
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
          uniform float uHighlight;
          void main() {
            float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 3.0);
            float scan = step(0.992, sin(vPos.y * 30.0 + uTime * 0.4) * 0.5 + 0.5);
            vec3 col = mix(vec3(0.005, 0.02, 0.08), vec3(0.15, 0.42, 1.0), fresnel * 0.85);
            col += scan * 0.06 * vec3(0.5, 0.7, 1.0);
            col = mix(col, vec3(0.18, 0.52, 1.0), uHighlight * fresnel * 0.6);
            gl_FragColor = vec4(col, 0.15 + fresnel * (0.62 + uHighlight * 0.2));
          }
        `}
      />
    </mesh>
  );
}

/** Pure 3D markers — no DOM / Html overlays inside the canvas. */
function TermMarker({
  term,
  position,
  isActive,
  dimOthers,
  onEnter,
  onLeave,
}: {
  term: Term;
  position: [number, number, number];
  isActive: boolean;
  dimOthers: boolean;
  onEnter: (t: Term) => void;
  onLeave: () => void;
}) {
  const size = isActive ? 0.1 : 0.065;
  const opacity = isActive ? 1 : dimOthers ? 0.25 : 0.8;

  return (
    <mesh
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onEnter(term);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onLeave();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onEnter(term);
      }}
    >
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color={term.color} transparent opacity={opacity} />
    </mesh>
  );
}

function TermMarkers({
  active,
  onEnter,
  onLeave,
}: {
  active: string | null;
  onEnter: (t: Term) => void;
  onLeave: () => void;
}) {
  const positions = useMemo(() => fibSphere(TERMS.length, LABEL_RADIUS), []);

  return (
    <>
      {TERMS.map((t, i) => (
        <TermMarker
          key={t.label}
          term={t}
          position={positions[i]}
          isActive={active === t.label}
          dimOthers={active !== null && active !== t.label}
          onEnter={onEnter}
          onLeave={onLeave}
        />
      ))}
    </>
  );
}

function Ring({ radius, tilt, speed, color, opacity }: {
  radius: number; tilt: number; speed: number; color: string; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * speed; });
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
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.025; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#9ec5ff" transparent opacity={0.45} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function GlobeGroup({
  mouse,
  drag,
  active,
  onEnter,
  onLeave,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  drag: MutableRefObject<{ rotY: number; rotX: number; spinning: boolean }>;
  active: string | null;
  onEnter: (t: Term) => void;
  onLeave: () => void;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    if (!drag.current.spinning) drag.current.rotY += AUTO_SPIN;
    drag.current.spinning = false;
    ref.current.rotation.y = drag.current.rotY;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      drag.current.rotX + mouse.current.y * 0.12,
      0.04,
    );
  });

  return (
    <group ref={ref} scale={GLOBE_SCALE}>
      <GlobeCore highlighted={active !== null} />
      <GlobeWireframe />
      <TermMarkers active={active} onEnter={onEnter} onLeave={onLeave} />
      <Ring radius={R * 1.2} tilt={Math.PI / 6} speed={0.14} color="#4f8cff" opacity={0.4} />
      <Ring radius={R * 1.38} tilt={-Math.PI / 4} speed={-0.09} color="#8b5cf6" opacity={0.28} />
      <Ring radius={R * 1.52} tilt={Math.PI / 2.5} speed={0.06} color="#4f8cff" opacity={0.15} />
    </group>
  );
}

function CameraFit() {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (size.width < 1 || size.height < 1) return;
    cam.fov = CAMERA_FOV;
    cam.updateProjectionMatrix();
    const aspect = size.width / size.height;
    const tanHalf = Math.tan((CAMERA_FOV * Math.PI) / 180 / 2);
    const distV = FIT_RADIUS / tanHalf;
    const distH = FIT_RADIUS / (tanHalf * aspect);
    cam.position.set(0, 0, Math.max(distV, distH) * FIT_MARGIN);
    cam.lookAt(0, 0, 0);
  }, [camera, size.width, size.height]);

  return null;
}

function Scene({
  mouse, drag, active, onEnter, onLeave, tier,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>;
  drag: MutableRefObject<{ rotY: number; rotX: number; spinning: boolean }>;
  active: string | null;
  onEnter: (t: Term) => void;
  onLeave: () => void;
  tier: string;
}) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 4, 3]} intensity={24} color="#4f8cff" />
      <pointLight position={[-4, -2, 2]} intensity={14} color="#8b5cf6" />
      <CameraFit />
      <GlobeGroup mouse={mouse} drag={drag} active={active} onEnter={onEnter} onLeave={onLeave} />
      <Particles count={tier === "high" ? 70 : 35} />
    </>
  );
}

/** Term detail — regular HTML outside the WebGL canvas (never portaled into 3D). */
function TermPanel({ term, onClose }: { term: Term; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="pointer-events-auto absolute bottom-20 left-1/2 z-20 w-[min(92%,18rem)] -translate-x-1/2 overflow-hidden rounded-xl border bg-black/85 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-md"
      style={{ borderColor: `${term.color}44` }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: term.color, boxShadow: `0 0 8px ${term.color}` }} />
          <p className="font-display text-sm font-bold text-white">{term.label}</p>
        </div>
        <button type="button" onClick={onClose} className="font-sans text-[10px] uppercase tracking-widest text-white/35 hover:text-white/70">
          Close
        </button>
      </div>
      <p className="font-body text-[11px] leading-relaxed text-white/60">{term.detail}</p>
      <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.24em]" style={{ color: term.color }}>
        {CAT_LABELS[term.cat]}
      </p>
    </motion.div>
  );
}

export function FinanceGlobe() {
  const mouse = useRef({ x: 0, y: 0 });
  const drag = useRef({ rotY: 0, rotX: 0, spinning: false });
  const pointer = useRef({ down: false, lastX: 0, lastY: 0 });
  const [activeTerm, setActiveTerm] = useState<Term | null>(null);
  const { tier, dpr, enableWebGL } = usePerfFlags();

  const onEnter = useCallback((t: Term) => setActiveTerm(t), []);
  const onLeave = useCallback(() => setActiveTerm(null), []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointer.current = { down: true, lastX: e.clientX, lastY: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
    if (!pointer.current.down) return;
    const dx = e.clientX - pointer.current.lastX;
    const dy = e.clientY - pointer.current.lastY;
    drag.current.rotY += dx * DRAG_SENSITIVITY;
    drag.current.rotX += dy * DRAG_SENSITIVITY * 0.6;
    drag.current.rotX = Math.max(-0.7, Math.min(0.7, drag.current.rotX));
    drag.current.spinning = true;
    pointer.current.lastX = e.clientX;
    pointer.current.lastY = e.clientY;
  }, []);

  const onPointerUp = useCallback(() => {
    pointer.current.down = false;
  }, []);

  if (!enableWebGL) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center" aria-hidden>
        <div
          className="h-56 w-56 rounded-full md:h-72 md:w-72"
          style={{
            background: "radial-gradient(circle, rgba(79,140,255,0.28) 0%, rgba(139,92,246,0.15) 45%, transparent 70%)",
            boxShadow: "0 0 80px rgba(79,140,255,0.3)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative h-full min-h-[280px] w-full md:min-h-[100svh]"
      style={{ cursor: pointer.current.down ? "grabbing" : "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        className="!absolute inset-0 !h-full !w-full"
        dpr={[1, Math.min(dpr, 1.5)]}
        camera={{ position: [0, 0, 8], fov: CAMERA_FOV }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene
            mouse={mouse}
            drag={drag}
            active={activeTerm?.label ?? null}
            onEnter={onEnter}
            onLeave={onLeave}
            tier={tier}
          />
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {activeTerm ? <TermPanel term={activeTerm} onClose={onLeave} /> : null}
      </AnimatePresence>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-1 md:flex">
        {Object.entries(CAT_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: CAT_COLORS[key] }} />
            <span className="font-sans text-[8px] uppercase tracking-[0.22em] text-white/30">{label}</span>
          </div>
        ))}
      </div>

      {!activeTerm ? (
        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[9px] uppercase tracking-[0.35em] text-white/30">
          Drag globe · Hover points
        </p>
      ) : null}
    </div>
  );
}
