"use client";

import { useEffect, useRef } from "react";

/**
 * CursorWaves — Continuous fluid wave-field renderer.
 *
 * Maintains a 2D grid of amplitude nodes.  When the cursor moves, nodes near
 * the cursor receive an amplitude "kick" proportional to speed.  Each frame:
 *   1. Amplitudes diffuse outward to neighbours (wave propagation).
 *   2. All amplitudes decay (damping).
 *   3. The displaced grid is drawn as smooth bezier polylines.
 *
 * No external libraries.  Pure Canvas 2D, requestAnimationFrame.
 * pointer-events: none — fully invisible to interactions.
 * Respects prefers-reduced-motion and skips on coarse/touch pointers.
 */

const COLS = 48;
const ROWS = 32;
const DAMPING = 0.88; // amplitude decay per frame
const DIFFUSION = 0.18; // how much amplitude spreads to neighbours
const CURSOR_RADIUS_FRACTION = 0.12; // fraction of canvas width that cursor affects
const WAVE_COLOR = "59, 130, 246"; // matches brand blue

export function CursorWaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || isCoarsePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- State ---
    let W = 0;
    let H = 0;
    let cellW = 0;
    let cellH = 0;

    // Two amplitude buffers (current + next) for wave diffusion
    const amp: Float32Array = new Float32Array((COLS + 1) * (ROWS + 1));
    const nextAmp: Float32Array = new Float32Array((COLS + 1) * (ROWS + 1));

    const idx = (col: number, row: number) =>
      row * (COLS + 1) + col;

    // Cursor state (viewport coords, updated passively)
    let cursorX = -9999;
    let cursorY = -9999;
    let cursorVel = 0;
    let lastCX = 0;
    let lastCY = 0;
    let lastTime = performance.now();
    let hasMoved = false;

    let animId: number;

    // --- Resize ---
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cellW = W / COLS;
      cellH = H / ROWS;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // --- Mouse ---
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      if (!hasMoved) {
        lastCX = e.clientX;
        lastCY = e.clientY;
        hasMoved = true;
      }

      const dx = e.clientX - lastCX;
      const dy = e.clientY - lastCY;
      const dist = Math.hypot(dx, dy);

      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorVel = dt > 0 ? Math.min((dist / dt) * 18, 1) : 0;

      lastCX = e.clientX;
      lastCY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- Wave simulation step ---
    const simulate = () => {
      // 1. Apply cursor kick to nearby nodes
      if (hasMoved && cursorVel > 0.02) {
        const kickRadius = W * CURSOR_RADIUS_FRACTION;
        const kickStrength = cursorVel * 0.6;

        for (let row = 0; row <= ROWS; row++) {
          for (let col = 0; col <= COLS; col++) {
            const nx = col * cellW;
            const ny = row * cellH;
            const dist = Math.hypot(nx - cursorX, ny - cursorY);
            if (dist < kickRadius) {
              const influence = (1 - dist / kickRadius) ** 2;
              amp[idx(col, row)] = Math.min(
                1,
                amp[idx(col, row)] + influence * kickStrength
              );
            }
          }
        }
        // Decay velocity so stationary cursor doesn't continuously excite
        cursorVel *= 0.7;
      }

      // 2. Diffuse + damp into nextAmp buffer
      for (let row = 0; row <= ROWS; row++) {
        for (let col = 0; col <= COLS; col++) {
          const self = amp[idx(col, row)];
          // Sample up to 4 neighbours, clamped at edges
          const n =
            row > 0 ? amp[idx(col, row - 1)] : self;
          const s =
            row < ROWS ? amp[idx(col, row + 1)] : self;
          const ww =
            col > 0 ? amp[idx(col - 1, row)] : self;
          const e =
            col < COLS ? amp[idx(col + 1, row)] : self;

          const diffused =
            self * (1 - DIFFUSION) +
            ((n + s + ww + e) / 4) * DIFFUSION;

          nextAmp[idx(col, row)] = diffused * DAMPING;
        }
      }

      // 3. Swap buffers
      amp.set(nextAmp);
    };

    // --- Render ---
    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      simulate();

      ctx.clearRect(0, 0, W, H);

      // Draw horizontal wave lines
      for (let row = 0; row <= ROWS; row++) {
        ctx.beginPath();
        let started = false;

        for (let col = 0; col <= COLS; col++) {
          const baseX = col * cellW;
          const baseY = row * cellH;
          const a = amp[idx(col, row)];

          // Displace Y proportionally to amplitude
          const displaceY = baseY - a * cellH * 1.4;

          if (!started) {
            ctx.moveTo(baseX, displaceY);
            started = true;
          } else {
            // Use midpoints for smooth bezier curvature
            const prevBaseX = (col - 1) * cellW;
            const prevA = amp[idx(col - 1, row)];
            const prevDispY = baseY - prevA * cellH * 1.4;
            const cpX = (prevBaseX + baseX) / 2;
            ctx.quadraticCurveTo(prevBaseX, prevDispY, cpX, (prevDispY + displaceY) / 2);
          }
        }

        // Opacity proportional to max amplitude in this row
        let maxA = 0;
        for (let col = 0; col <= COLS; col++) {
          maxA = Math.max(maxA, amp[idx(col, row)]);
        }

        if (maxA < 0.004) continue; // skip nearly-flat rows (no draw call)

        const opacity = Math.min(maxA * 0.55, 0.22);
        ctx.strokeStyle = `rgba(${WAVE_COLOR}, ${opacity})`;
        ctx.lineWidth = 1 + maxA * 1.2;
        ctx.stroke();
      }

      // Draw vertical wave lines (thinner, for grid feel)
      for (let col = 0; col <= COLS; col++) {
        ctx.beginPath();
        let started = false;

        for (let row = 0; row <= ROWS; row++) {
          const baseX = col * cellW;
          const baseY = row * cellH;
          const a = amp[idx(col, row)];
          const displaceX = baseX - a * cellW * 1.0;

          if (!started) {
            ctx.moveTo(displaceX, baseY);
            started = true;
          } else {
            const prevRow = row - 1;
            const prevBaseY = prevRow * cellH;
            const prevA = amp[idx(col, prevRow)];
            const prevDispX = baseX - prevA * cellW * 1.0;
            const cpY = (prevBaseY + baseY) / 2;
            ctx.quadraticCurveTo(prevDispX, prevBaseY, (prevDispX + displaceX) / 2, cpY);
          }
        }

        let maxA = 0;
        for (let row = 0; row <= ROWS; row++) {
          maxA = Math.max(maxA, amp[idx(col, row)]);
        }
        if (maxA < 0.004) continue;

        const opacity = Math.min(maxA * 0.3, 0.12);
        ctx.strokeStyle = `rgba(${WAVE_COLOR}, ${opacity})`;
        ctx.lineWidth = 0.5 + maxA * 0.8;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      if (document.hidden) amp.fill(0);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 opacity-80"
      aria-hidden="true"
    />
  );
}
