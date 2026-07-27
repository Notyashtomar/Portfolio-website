import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Vercel + Three.js: transpile packages that use ESM
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "postprocessing",
  ],

  // Silence the server-action size warning on Vercel
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "gsap",
    ],
  },
};

export default nextConfig;
