"use client";

import { useEffect, useRef } from "react";

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; golden: boolean }[] = [];
    let animId: number;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * 1.5 + 0.3,
        speedY: Math.random() * 0.3 + 0.05,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.05,
        golden: Math.random() > 0.7,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: 60 }, () => createParticle());
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((p) => {
        // Update
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10 || p.x < -10 || p.x > canvas!.width + 10) {
          p.x = Math.random() * canvas!.width;
          p.y = canvas!.height + 10;
        }
        // Draw
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.golden
          ? `rgba(212, 175, 55, ${p.opacity})`
          : `rgba(255, 255, 255, ${p.opacity * 0.5})`;
        ctx!.fill();
      });
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    init();
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-30"
    />
  );
}
