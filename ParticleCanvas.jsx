import { useEffect, useRef } from "react";

/**
 * Reusable Particle Canvas Animation
 * Optimized version to replace duplicate canvas code across components
 * 
 * Props:
 * - particleCount: number of particles (default: 60, reduced from 80 for performance)
 * - colors: array of color strings (default: pink + green)
 * - speed: particle movement speed multiplier (default: 1)
 * - className: additional CSS classes
 */
export default function ParticleCanvas({ 
  particleCount = 60,  // Reduced from 80 for better performance
  colors = ["rgba(251, 10, 139, 0.25)", "rgba(0, 226, 110, 0.3)"],
  speed = 1,
  className = ""
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { alpha: true });
    
    // Set canvas size
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };
    
    setSize();

    // Initialize particles only once
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          dx: (Math.random() * 0.6 - 0.3) * speed,
          dy: (Math.random() * 0.6 - 0.3) * speed,
        });
      }
    }

    // Animation loop with requestAnimationFrame
    const animate = () => {
      // Clear with white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        
        // Move particles
        p.x += p.dx;
        p.y += p.dy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle window resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setSize();
        // Reinitialize particles for new canvas size
        particlesRef.current = [];
        for (let i = 0; i < particleCount; i++) {
          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            dx: (Math.random() * 0.6 - 0.3) * speed,
            dy: (Math.random() * 0.6 - 0.3) * speed,
          });
        }
      }, 150);
    };
    
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, colors, speed]);

  return (
    <canvas 
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full z-0 ${className}`}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
