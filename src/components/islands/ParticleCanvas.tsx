import { useEffect, useRef } from "react";

interface ParticleCanvasProps {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  className?: string;
}

interface Particle {
  x: number; y: number; r: number;
  color: string; dx: number; dy: number;
}

export default function ParticleCanvas({
  particleCount = 60,
  colors = ["rgba(251,10,139,0.25)", "rgba(0,226,110,0.30)"],
  speed = 1,
  className = "",
}: ParticleCanvasProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const rafRef         = useRef<number>(0);
  const particlesRef   = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const setSize = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width  = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    setSize();

    const makeParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        dx:    (Math.random() * 0.6 - 0.3) * speed,
        dy:    (Math.random() * 0.6 - 0.3) * speed,
      }));
    };
    if (!particlesRef.current.length) makeParticles();

    const animate = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { setSize(); makeParticles(); }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [particleCount, colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
