import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";

/* ---- Canvas universe animation ---- */
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

        // Stars
        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.4 + 0.1,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
        }));

        // Nebula blobs
        const blobs = [
            { x: 0.15, y: 0.3, r: 280, color: "rgba(56,139,253," },
            { x: 0.85, y: 0.7, r: 220, color: "rgba(88,56,253," },
            { x: 0.5,  y: 0.9, r: 180, color: "rgba(88,214,245," },
            { x: 0.7,  y: 0.15, r: 150, color: "rgba(168,56,253," },
        ];

        // Shooting stars
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

        // Floating particles
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

            // Deep space background
            const bg = ctx.createLinearGradient(0, 0, W, H);
            bg.addColorStop(0, "#03060f");
            bg.addColorStop(0.5, "#07091a");
            bg.addColorStop(1, "#020510");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            // Nebula blobs
            blobs.forEach((b) => {
                const pulse = 0.04 + 0.015 * Math.sin(t + b.x * 10);
                const grad = ctx.createRadialGradient(
                    b.x * W, b.y * H, 0,
                    b.x * W, b.y * H, b.r
                );
                grad.addColorStop(0, b.color + pulse + ")");
                grad.addColorStop(1, b.color + "0)");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(b.x * W, b.y * H, b.r, b.r * 0.7, t * 0.1, 0, Math.PI * 2);
                ctx.fill();
            });

            // Stars twinkle
            stars.forEach((s) => {
                s.alpha += s.twinkleSpeed * s.twinkleDir;
                if (s.alpha >= 1 || s.alpha <= 0.1) s.twinkleDir *= -1;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
                ctx.fill();
            });

            // Shooting stars
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

            // Floating particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56,139,253,${p.alpha})`;
                ctx.fill();
            });

            // Grid lines (subtle)
            ctx.strokeStyle = "rgba(56,139,253,0.04)";
            ctx.lineWidth = 1;
            const gridSize = 80;
            for (let x = 0; x < W; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y < H; y += gridSize) {
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

    return <canvas ref={canvasRef} style={s.canvas} />;
};

/* ---- Login form ---- */
const Login = () => {
    const { login, cargando } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ correo: "", contrasena: "", recordar: false });
    const [errores, setErrores] = useState({});
    const [focused, setFocused] = useState(null);

    const validar = () => {
        const e = {};
        if (!form.correo.trim()) e.correo = "El correo es obligatorio";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo no válido";
        if (!form.contrasena) e.contrasena = "La contraseña es obligatoria";
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;
        try {
            await login(form.correo, form.contrasena, form.recordar);
            navigate("/");
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo iniciar sesión";
            Swal.fire({ icon: "error", title: "Error", text: mensaje, background: "#0d1426", color: "#e2e8f0", confirmButtonColor: "#388bfd" });
        }
    };

    return (
        <div style={s.page}>
            <UniverseCanvas />

            {/* Glassmorphism card */}
            <div className="animate-slideUp" style={s.card}>

                {/* Logo */}
                <div className="text-center mb-4 animate-fadeIn">
                    <div className="animate-pulse-glow" style={s.logoBox}>
                        <i className="bi bi-check2-square" style={s.logoIcon}></i>
                    </div>
                    <h1 style={s.title}>
                        Task<span style={s.titleAccent}>Flow</span>
                    </h1>
                    <p style={s.subtitle}>Accede a tu espacio de trabajo</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Correo */}
                    <div className="mb-3 animate-slideLeft delay-1">
                        <label className="tf-label">Correo electrónico</label>
                        <div style={s.inputWrapper}>
                            <i
                                className="bi bi-envelope"
                                style={{ ...s.inputIcon, color: focused === "correo" ? "#388bfd" : "#718096" }}
                            ></i>
                            <input
                                type="email"
                                name="correo"
                                className="tf-input tf-input-icon"
                                style={s.inputFull}
                                value={form.correo}
                                onChange={handleChange}
                                onFocus={() => setFocused("correo")}
                                onBlur={() => setFocused(null)}
                                placeholder="tu@correo.com"
                            />
                        </div>
                        {errores.correo && <div className="tf-error">{errores.correo}</div>}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3 animate-slideLeft delay-2">
                        <label className="tf-label">Contraseña</label>
                        <div style={s.inputWrapper}>
                            <i
                                className="bi bi-lock"
                                style={{ ...s.inputIcon, color: focused === "contrasena" ? "#388bfd" : "#718096" }}
                            ></i>
                            <input
                                type="password"
                                name="contrasena"
                                className="tf-input tf-input-icon"
                                style={s.inputFull}
                                value={form.contrasena}
                                onChange={handleChange}
                                onFocus={() => setFocused("contrasena")}
                                onBlur={() => setFocused(null)}
                                placeholder="••••••••"
                            />
                        </div>
                        {errores.contrasena && <div className="tf-error">{errores.contrasena}</div>}
                    </div>

                    {/* Recordar sesión — usa localStorage o sessionStorage según este flag */}
                    <div className="mb-4 animate-slideLeft delay-3" style={s.checkRow}>
                        <input
                            type="checkbox"
                            name="recordar"
                            className="tf-checkbox"
                            checked={form.recordar}
                            onChange={handleChange}
                            id="recordarSesion"
                        />
                        <label htmlFor="recordarSesion" style={s.checkLabel}>
                            Recordar sesión
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="tf-btn tf-btn-primary w-100 animate-slideLeft delay-4"
                        style={s.submitBtn}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                                <span style={s.spinner}></span>
                                Ingresando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-arrow-right-circle"></i>
                                Ingresar
                            </>
                        )}
                    </button>
                </form>

                <hr className="tf-divider" />

                <p style={s.footerText}>
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" style={s.footerLink}>
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
};

const s = {
    canvas: {
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
    },
    page: {
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "420px",
        margin: "1rem",
        background: "rgba(10, 15, 30, 0.75)",
        border: "1px solid rgba(56,139,253,0.25)",
        borderRadius: "20px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,139,253,0.1)",
        padding: "2.5rem",
    },
    logoBox: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(56,139,253,0.2), rgba(56,139,253,0.05))",
        border: "1px solid rgba(56,139,253,0.4)",
        marginBottom: "1rem",
    },
    logoIcon: {
        fontSize: "1.6rem",
        color: "#388bfd",
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "#e2e8f0",
        margin: 0,
    },
    titleAccent: {
        color: "#388bfd",
        textShadow: "0 0 20px rgba(56,139,253,0.6)",
    },
    subtitle: {
        fontSize: "0.8rem",
        color: "#718096",
        marginTop: "0.25rem",
    },
    inputWrapper: {
        position: "relative",
    },
    inputIcon: {
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        transition: "color 0.2s",
        zIndex: 1,
        fontSize: "0.9rem",
    },
    inputFull: {
        width: "100%",
    },
    checkRow: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    checkLabel: {
        fontSize: "0.85rem",
        color: "#718096",
        cursor: "pointer",
    },
    submitBtn: {
        width: "100%",
    },
    spinner: {
        width: "16px",
        height: "16px",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin-slow 0.7s linear infinite",
        display: "inline-block",
    },
    footerText: {
        textAlign: "center",
        fontSize: "0.85rem",
        color: "#718096",
        margin: 0,
    },
    footerLink: {
        color: "#388bfd",
        textDecoration: "none",
        fontWeight: 600,
    },
};

export default Login;
