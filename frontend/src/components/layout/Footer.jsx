const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer style={{
            background: "rgba(7,11,20,0.95)",
            borderTop: "1px solid rgba(56,139,253,0.15)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
        }}>
            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#388bfd", textShadow: "0 0 12px rgba(56,139,253,0.4)" }}>
                Task<span style={{ color: "#58d6f5" }}>Flow</span>
                <span style={{ fontWeight: 400, fontSize: "0.75rem", color: "#718096", marginLeft: "0.5rem" }}>
                    Sistema de gestión de tareas
                </span>
            </span>
            <span style={{ fontSize: "0.75rem", color: "#718096" }}>
                v1.0.0 &nbsp;·&nbsp; © {year} TaskFlow
            </span>
        </footer>
    );
};

export default Footer;
