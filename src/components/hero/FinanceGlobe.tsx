"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { usePerfFlags } from "@/components/providers/Providers";

/* ─── Constants ──────────────────────────────────────────────── */
const R = 2;
const DRAG_SENSITIVITY = 0.006;
const AUTO_SPIN = 0.0014; // radians per frame when idle

/* ─── Term data with tooltip context ────────────────────────── */
const TERMS = [
  /* ── Finance Ratios ── */
  { label: "EBITDA",      color: "#4f8cff", cat: "Ratios",   detail: "Tracked EBITDA trends for portfolio companies feeding leadership dashboards." },
  { label: "ROI",         color: "#4f8cff", cat: "Ratios",   detail: "Automated ROI reporting across fund investments using Excel & Power BI." },
  { label: "IRR",         color: "#4f8cff", cat: "Ratios",   detail: "Built IRR computation pipelines for deal evaluation and exit modelling." },
  { label: "NPV",         color: "#4f8cff", cat: "Ratios",   detail: "NPV models for capex planning and multi-year financial projection decks." },
  { label: "CAGR",        color: "#4f8cff", cat: "Ratios",   detail: "Portfolio CAGR surfaces surfaced in executive reports and investor updates." },
  { label: "Sharpe",      color: "#4f8cff", cat: "Ratios",   detail: "Risk-adjusted return analysis used in fund strategy presentations." },
  { label: "VaR",         color: "#4f8cff", cat: "Ratios",   detail: "Value at Risk computation for portfolio risk and compliance." },
  /* ── Finance Tools ── */
  { label: "SAP FICO",    color: "#22d3ee", cat: "Tools",    detail: "ERP-level financial control — GL, AP/AR, and cost-centre mapping using SAP FICO for audit-ready reporting." },
  { label: "DCF Model",   color: "#22d3ee", cat: "Tools",    detail: "Discounted Cash Flow modeling to derive intrinsic equity value from multi-year free-cash-flow projections." },
  { label: "Valuation",   color: "#22d3ee", cat: "Tools",    detail: "Business valuation via DCF, EV/EBITDA, and P/E comparable-company analysis to support investment decisions." },
  { label: "LBO Model",   color: "#22d3ee", cat: "Tools",    detail: "Leveraged Buyout modeling — debt waterfalls, IRR sensitivity tables, and exit-multiple analysis for PE deals." },
  { label: "M&A",         color: "#22d3ee", cat: "Tools",    detail: "Merger & Acquisition analytics: synergy mapping, accretion/dilution tests, and deal-structure modelling." },
  { label: "P&L",         color: "#22d3ee", cat: "Tools",    detail: "Automated P&L dashboards cutting monthly close time by 35% at Bird Group." },
  { label: "MIS",         color: "#22d3ee", cat: "Tools",    detail: "End-to-end MIS pipeline serving leadership at Bird Group and Wistful Finance." },
  /* ── Analytics ── */
  { label: "Alpha",       color: "#ff3d9a", cat: "Analytics", detail: "Alpha attribution analysis for fund strategies via Python & Excel." },
  { label: "Beta",        color: "#ff3d9a", cat: "Analytics", detail: "Beta-adjusted risk analysis wired into investor reporting workflows." },
  { label: "Volatility",  color: "#ff3d9a", cat: "Analytics", detail: "Rolling volatility models powering risk management and compliance." },
  { label: "ARIMA",       color: "#ff3d9a", cat: "Analytics", detail: "ARIMA time-series models for revenue and expense forecasting." },
  { label: "Regression",  color: "#ff3d9a", cat: "Analytics", detail: "Multiple regression for cost-driver and performance attribution." },
  { label: "Forecasting", color: "#ff3d9a", cat: "Analytics", detail: "Multi-horizon forecast models powering executive strategy sessions." },
  { label: "Risk Mgmt",   color: "#ff3d9a", cat: "Analytics", detail: "Integrated risk frameworks covering market, credit, and operational risk." },
  /* ── Engineering ── */
  { label: "Python",      color: "#8b5cf6", cat: "Eng",      detail: "Python scripts for data pipelines, automation, and ML forecasting." },
  { label: "SQL",         color: "#8b5cf6", cat: "Eng",      detail: "Advanced SQL cutting data extraction time by 40% at SLA." },
] as const;

const CAT_COLORS: Record<string, string> = {
  Ratios:    "#4f8cff",
  Tools:     "#22d3ee",
  Analytics: "#ff3d9a",
  Eng:       "#8b5cf6",
};
const CAT_LABELS: Record<string, string> = {
  Ratios:    "Finance Ratios",
  Tools:     "Finance Tools",
  Analytics: "Analytics",
  Eng:       "Engineering",
};

type Term = (typeof TERMS)[number];

/* ─── Fibonacci sphere layout ───────────────────────────────── */
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

/* ─── Globe wireframe ────────────────────────────────────────── */
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
      <lineBasicMaterial color="#4f8cff" transparent opacity={0.16} />
    </lineSegments>
  );
}

/* ─── Globe core (fresnel + scan shader) ────────────────────── */
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

/* ─── Interactive term labels ────────────────────────────────── */
function TermLabels({
  active,
  onEnter,
  onLeave,
}: {
  active: string | null;
  onEnter: (t: Term) => void;
  onLeave: () => void;
}) {
  const positions = useMemo(() => fibSphere(TERMS.length, R * 1.25), []);

  return (
    <>
      {TERMS.map((t, i) => {
        const isActive = active === t.label;
        return (
          <Html key={t.label} position={positions[i]} center occlude={false}>
            <button
              type="button"
              onPointerEnter={() => onEnter(t)}
              onPointerLeave={onLeave}
              onClick={() => isActive ? onLeave() : onEnter(t)}
              style={{
                color: isActive ? "#ffffff" : t.color,
                background: isActive ? `${t.color}22` : "transparent",
                border: isActive ? `1px solid ${t.color}66` : "1px solid transparent",
                borderRadius: "4px",
                padding: isActive ? "2px 7px" : "2px 5px",
                fontFamily: "'Cabinet Grotesk', 'Satoshi', monospace",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                cursor: "pointer",
                userSelect: "none",
                outline: "none",
                opacity: active && !isActive ? 0.35 : 0.88,
                transform: isActive ? "scale(1.25)" : "scale(1)",
                textShadow: isActive ? `0 0 20px ${t.color}, 0 0 40px ${t.color}88` : `0 0 12px ${t.color}88`,
                boxShadow: isActive ? `0 0 20px ${t.color}44` : "none",
                transition: "all 0.2s ease",
                pointerEvents: "all",
              }}
            >
              {t.label}
            </button>
          </Html>
        );
      })}
    </>
  );
}

/* ─── Orbit ring ─────────────────────────────────────────────── */
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

/* ─── Particles ──────────────────────────────────────────────── */
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
      <pointsMaterial size={0.018} color="#9ec5ff" transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ─── Globe group — reads drag + mouse ──────────────────────── */
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
    if (!drag.current.spinning) {
      drag.current.rotY += AUTO_SPIN;
    }
    drag.current.spinning = false;
    ref.current.rotation.y = drag.current.rotY;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      drag.current.rotX + mouse.current.y * 0.12,
      0.04,
    );
  });

  return (
    <group ref={ref}>
      <GlobeCore highlighted={active !== null} />
      <GlobeWireframe />
      <TermLabels active={active} onEnter={onEnter} onLeave={onLeave} />
      <Ring radius={R * 1.2}  tilt={Math.PI / 6}   speed={0.14}  color="#4f8cff" opacity={0.4} />
      <Ring radius={R * 1.38} tilt={-Math.PI / 4}  speed={-0.09} color="#8b5cf6" opacity={0.28} />
      <Ring radius={R * 1.52} tilt={Math.PI / 2.5} speed={0.06}  color="#4f8cff" opacity={0.15} />
    </group>
  );
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
  const isHigh = tier === "high";
  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[5, 4, 3]} intensity={24} color="#4f8cff" />
      <pointLight position={[-4, -2, 2]} intensity={14} color="#8b5cf6" />
      <pointLight position={[0, -4, 0]} intensity={8} color="#ff3d9a" />
      <GlobeGroup mouse={mouse} drag={drag} active={active} onEnter={onEnter} onLeave={onLeave} />
      <Particles count={isHigh ? 90 : 55} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={isHigh ? 2.2 : 1.4} luminanceThreshold={0.08} luminanceSmoothing={0.92} mipmapBlur />
      </EffectComposer>
    </>
  );
}

/* ─── Tooltip card ───────────────────────────────────────────── */
function Tooltip({ term }: { term: Term | null }) {
  return (
    <AnimatePresence mode="wait">
      {term ? (
        <motion.div
          key={term.label}
          initial={{ opacity: 0, y: 14, scale: 0.96, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 8, scale: 0.97, filter: "blur(6px)" }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 w-72 -translate-x-1/2 overflow-hidden rounded-2xl bg-black/90 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(79,140,255,0.18)] backdrop-blur-xl md:left-auto md:right-8 md:translate-x-0"
          style={{ border: `1px solid ${term.color}44` }}
        >
          {/* Top accent bar */}
          <motion.div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${term.color}, transparent)` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div className="p-4">
            {/* Header row */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <motion.span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: term.color }}
                  animate={{ boxShadow: [`0 0 4px ${term.color}88`, `0 0 12px ${term.color}`, `0 0 4px ${term.color}88`] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="font-display text-[15px] font-bold tracking-wide text-white">{term.label}</p>
              </div>
              {/* Category badge */}
              <span
                className="shrink-0 rounded px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.22em]"
                style={{ background: `${term.color}18`, color: term.color, border: `1px solid ${term.color}33` }}
              >
                {CAT_LABELS[term.cat]}
              </span>
            </div>

            <p className="font-body text-[11px] leading-[1.8] text-white/60">{term.detail}</p>

            {/* Bottom scan line */}
            <motion.div
              className="mt-3 h-px w-full"
              style={{ background: `linear-gradient(90deg, ${term.color}55, transparent)` }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="mt-1.5 font-sans text-[9px] uppercase tracking-[0.28em] text-white/25">
              SIGNAL · {term.cat.toUpperCase()} · ACTIVE
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ─── Main export ────────────────────────────────────────────── */
export function FinanceGlobe() {
  const mouse = useRef({ x: 0, y: 0 });
  const drag = useRef({ rotY: 0, rotX: 0, spinning: false });
  const pointer = useRef({ down: false, lastX: 0, lastY: 0 });
  const [activeTerm, setActiveTerm] = useState<Term | null>(null);
  const { tier, dpr, enableWebGL } = usePerfFlags();

  const onEnter = useCallback((t: Term) => setActiveTerm(t), []);
  const onLeave = useCallback(() => setActiveTerm(null), []);

  /* Drag handlers */
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
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <div
          className="h-72 w-72 rounded-full"
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
      className="absolute inset-0 select-none"
      style={{ cursor: pointer.current.down ? "grabbing" : "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 6.5], fov: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: true }}
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

      {/* Category legend — large screens only, top-left to avoid tooltip/hint overlap */}
      <motion.div
        className="pointer-events-none absolute left-4 top-5 z-10 hidden flex-col gap-1.5 lg:flex"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.7 }}
      >
        {Object.entries(CAT_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: CAT_COLORS[key], boxShadow: `0 0 5px ${CAT_COLORS[key]}88` }}
            />
            <span className="font-sans text-[8px] uppercase tracking-[0.24em] text-white/30">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Drag hint */}
      <AnimatePresence>
        {!activeTerm ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-sans text-[9px] uppercase tracking-[0.4em] text-white/35 md:hidden"
          >
            Drag · Tap terms
          </motion.p>
        ) : null}
      </AnimatePresence>

      <Tooltip term={activeTerm} />
    </div>
  );
}
