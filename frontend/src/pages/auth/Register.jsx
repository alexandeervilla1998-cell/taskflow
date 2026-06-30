import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";

/* ---- Reutiliza el mismo canvas del Login ---- */
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
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
        }));

        const blobs = [
            { x: 0.85, y: 0.2, r: 260, color: "rgba(56,139,253," },
            { x: 0.1,  y: 0.8, r: 200, color: "rgba(88,56,253," },
            { x: 0.5,  y: 0.5, r: 160, color: "rgba(88,214,245," },
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
        const shootInterval = setInterval(spawnShoot, 3500);

        const particles = Array.from({ length: 35 }, () => ({
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

const Register = () => {
    const { registrar, cargando } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "" });
    const [errores, setErrores] = useState({});
    const [focused, setFocused] = useState(null);

    const validar = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
        if (!form.correo.trim()) e.correo = "El correo es obligatorio";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo no válido";
        if (!form.contrasena) e.contrasena = "La contraseña es obligatoria";
        else if (form.contrasena.length < 8) e.contrasena = "Mínimo 8 caracteres";
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;
        try {
            await registrar(form.nombre, form.correo, form.contrasena);
            navigate("/");
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo completar el registro";
            Swal.fire({ icon: "error", title: "Error", text: mensaje, background: "#0d1426", color: "#e2e8f0", confirmButtonColor: "#388bfd" });
        }
    };

    const fields = [
        { name: "nombre",    icon: "bi-person",   type: "text",     placeholder: "Tu nombre completo",  label: "Nombre" },
        { name: "correo",    icon: "bi-envelope",  type: "email",    placeholder: "tu@correo.com",       label: "Correo electrónico" },
        { name: "contrasena",icon: "bi-lock",      type: "password", placeholder: "Mínimo 8 caracteres", label: "Contraseña" },
    ];

    return (
        <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UniverseCanvas />

            <div
                className="animate-slideUp"
                style={{
                    position: "relative", zIndex: 10, width: "100%", maxWidth: "420px",
                    margin: "1rem",
                    background: "rgba(10, 15, 30, 0.75)",
                    border: "1px solid rgba(56,139,253,0.25)",
                    borderRadius: "20px",
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,139,253,0.1)",
                    padding: "2.5rem",
                }}
            >
                <div className="text-center mb-4 animate-fadeIn">
                    <div
                        className="animate-pulse-glow"
                        style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "56px", height: "56px", borderRadius: "16px",
                            background: "linear-gradient(135deg, rgba(56,139,253,0.2), rgba(56,139,253,0.05))",
                            border: "1px solid rgba(56,139,253,0.4)", marginBottom: "1rem",
                        }}
                    >
                        <i className="bi bi-person-plus" style={{ fontSize: "1.6rem", color: "#388bfd" }}></i>
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e2e8f0", margin: 0 }}>
                        Crear <span style={{ color: "#388bfd", textShadow: "0 0 20px rgba(56,139,253,0.6)" }}>cuenta</span>
                    </h1>
                    <p style={{ fontSize: "0.8rem", color: "#718096", marginTop: "0.25rem" }}>
                        Únete a TaskFlow
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {fields.map((f, i) => (
                        <div className={`mb-3 animate-slideLeft delay-${i + 1}`} key={f.name}>
                            <label className="tf-label">{f.label}</label>
                            <div style={{ position: "relative" }}>
                                <i
                                    className={`bi ${f.icon}`}
                                    style={{
                                        position: "absolute", left: "14px", top: "50%",
                                        transform: "translateY(-50%)",
                                        color: focused === f.name ? "#388bfd" : "#718096",
                                        transition: "color 0.2s", zIndex: 1, fontSize: "0.9rem"
                                    }}
                                ></i>
                                <input
                                    type={f.type}
                                    name={f.name}
                                    className={`tf-input${errores[f.name] ? " is-invalid" : ""}`}
                                    style={{ paddingLeft: "2.5rem", width: "100%" }}
                                    value={form[f.name]}
                                    onChange={handleChange}
                                    onFocus={() => setFocused(f.name)}
                                    onBlur={() => setFocused(null)}
                                    placeholder={f.placeholder}
                                />
                            </div>
                            {errores[f.name] && <div className="tf-error">{errores[f.name]}</div>}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="tf-btn tf-btn-primary"
                        style={{ width: "100%", marginTop: "0.5rem" }}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                                <span style={{
                                    width: "16px", height: "16px",
                                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                                    borderRadius: "50%", animation: "spin-slow 0.7s linear infinite", display: "inline-block"
                                }}></span>
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-rocket-takeoff"></i>
                                Registrarme
                            </>
                        )}
                    </button>
                </form>

                <hr className="tf-divider" />

                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#718096", margin: 0 }}>
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" style={{ color: "#388bfd", textDecoration: "none", fontWeight: 600 }}>
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
