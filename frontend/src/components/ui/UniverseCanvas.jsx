import { useEffect, useRef } from "react";

/* Fondo animado compartido entre Login y Register */
const UniverseCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.4 + 0.1,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
        }));

        const blobs = [
            { x: 0.15, y: 0.3,  r: 280, color: "rgba(56,139,253," },
            { x: 0.85, y: 0.7,  r: 220, color: "rgba(88,56,253,"  },
            { x: 0.5,  y: 0.9,  r: 180, color: "rgba(88,214,245," },
            { x: 0.7,  y: 0.15, r: 150, color: "rgba(168,56,253," },
        ];

        const shoots = [];
        const spawnShoot = () => {
            shoots.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight * 0.5,
                len: Math.random() * 120 + 60,
                speed: Math.random() * 6 + 4,
                alpha: 1,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
            });
        };
        const shootInterval = setInterval(spawnShoot, 3000);

        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 1,
            alpha: Math.random() * 0.4 + 0.1,
        }));

        let t = 0;

        const draw = () => {
            t += 0.008;
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            const bg = ctx.createLinearGradient(0, 0, W, H);
            bg.addColorStop(0, "#03060f");
            bg.addColorStop(0.5, "#07091a");
            bg.addColorStop(1, "#020510");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            blobs.forEach((b) => {
                const pulse = 0.04 + 0.015 * Math.sin(t + b.x * 10);
                const grad = ctx.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, b.r);
                grad.addColorStop(0, b.color + pulse + ")");
                grad.addColorStop(1, b.color + "0)");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(b.x * W, b.y * H, b.r, b.r * 0.7, t * 0.1, 0, Math.PI * 2);
                ctx.fill();
            });

            stars.forEach((s) => {
                s.alpha += s.twinkleSpeed * s.twinkleDir;
                if (s.alpha >= 1 || s.alpha <= 0.1) s.twinkleDir *= -1;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
                ctx.fill();
            });

            for (let i = shoots.length - 1; i >= 0; i--) {
                const s = shoots[i];
                const dx = Math.cos(s.angle) * s.len;
                const dy = Math.sin(s.angle) * s.len;
                const grad = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
                grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
                grad.addColorStop(1, "rgba(255,255,255,0)");
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - dx, s.y - dy);
                ctx.stroke();
                s.x += Math.cos(s.angle) * s.speed;
                s.y += Math.sin(s.angle) * s.speed;
                s.alpha -= 0.018;
                if (s.alpha <= 0) shoots.splice(i, 1);
            }

            particles.forEach((p) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56,139,253,${p.alpha})`;
                ctx.fill();
            });

            ctx.strokeStyle = "rgba(56,139,253,0.04)";
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += 80) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y < H; y += 80) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            clearInterval(shootInterval);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }}
        />
    );
};

export default UniverseCanvas;
