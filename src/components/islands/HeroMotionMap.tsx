import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface RouteNode { id: string; x: number; y: number; color: string; size: number; }

const NODES: RouteNode[] = [
  { id:"hub",   x:50,  y:50,  color:"#fb0b8c", size:9  },
  { id:"n1",    x:18,  y:28,  color:"#2ae97b", size:5  },
  { id:"n2",    x:80,  y:22,  color:"#b993ff", size:5  },
  { id:"n3",    x:24,  y:72,  color:"#2ae97b", size:5  },
  { id:"n4",    x:78,  y:70,  color:"#fb0b8c", size:5  },
  { id:"n5",    x:50,  y:15,  color:"#b993ff", size:4  },
  { id:"n6",    x:15,  y:50,  color:"#fb0b8c", size:4  },
  { id:"n7",    x:85,  y:50,  color:"#2ae97b", size:4  },
  { id:"n8",    x:50,  y:85,  color:"#b993ff", size:4  },
];

const ROUTES = [
  { from:"n1",  to:"hub" },
  { from:"n2",  to:"hub" },
  { from:"n3",  to:"hub" },
  { from:"n4",  to:"hub" },
  { from:"n5",  to:"hub" },
  { from:"n6",  to:"hub" },
  { from:"n7",  to:"hub" },
  { from:"n8",  to:"hub" },
  { from:"n1",  to:"n2"  },
  { from:"n3",  to:"n4"  },
];

function getNode(id: string) { return NODES.find(n => n.id === id)!; }

export default function HeroMotionMap({ className = "" }: { className?: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`hmm-wrap ${className}`} aria-hidden="true">
      {/* Grid background */}
      <div className="hmm-grid" />

      {/* SVG routes */}
      <svg className="hmm-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="glow-pink">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {ROUTES.map((r, i) => {
          const a = getNode(r.from), b = getNode(r.to);
          const isActive = tick % ROUTES.length === i;
          return (
            <line key={`${r.from}-${r.to}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isActive ? "#fb0b8c" : "rgba(251,11,140,0.18)"}
              strokeWidth={isActive ? "0.55" : "0.25"}
              filter={isActive ? "url(#glow-pink)" : undefined}
              style={{ transition: "stroke 0.5s, stroke-width 0.5s" }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((n, i) => (
        <motion.div
          key={n.id}
          className="hmm-node"
          style={{
            left: `${n.x}%`, top: `${n.y}%`,
            width: n.size * 2, height: n.size * 2,
            background: n.color,
            boxShadow: `0 0 ${n.id === "hub" ? 18 : 8}px ${n.color}`,
          }}
          animate={{
            scale: tick % NODES.length === i ? [1, 1.5, 1] : 1,
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            scale: { duration: 0.5 },
            opacity: { duration: 2.4, repeat: Infinity, delay: i * 0.28 },
          }}
        />
      ))}

      {/* Hub label */}
      <motion.div
        className="hmm-hub-label"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      >
        PTDT
      </motion.div>

      <style>{`
        .hmm-wrap {
          position: relative; width: 100%; height: 100%;
          min-height: 320px; border-radius: 20px; overflow: hidden;
          background: #0a0a0f;
          border: 1px solid rgba(251,11,140,0.18);
        }
        .hmm-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(251,11,140,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,11,140,0.07) 1px, transparent 1px);
          background-size: 12.5% 12.5%;
        }
        .hmm-svg {
          position: absolute; inset: 0; width: 100%; height: 100%;
        }
        .hmm-node {
          position: absolute; border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .hmm-hub-label {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          font-size: 10px; font-weight: 900; color: #fb0b8c;
          letter-spacing: 0.06em;
          font-family: "IBM Plex Mono", monospace;
          text-shadow: 0 0 12px rgba(251,11,140,0.8);
          pointer-events: none;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
}
