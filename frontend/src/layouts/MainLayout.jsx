import { useState } from "react";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const MainLayout = ({ children }) => {
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    return (
        <div style={s.root}>
            <Navbar onToggleSidebar={() => setSidebarAbierto((prev) => !prev)} />

            <div style={s.body}>
                <div className="d-none d-md-flex" style={s.sidebarWrapper}>
                    <Sidebar />
                </div>

                {sidebarAbierto && (
                    <>
                        <div style={s.backdrop} onClick={() => setSidebarAbierto(false)} />
                        <div style={s.mobileSidebar}>
                            <Sidebar onClose={() => setSidebarAbierto(false)} />
                        </div>
                    </>
                )}

                <main style={s.main}>
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
};

// ---- Styles ----
const s = {
    root:          { display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--tf-bg)" },
    body:          { display: "flex", flexGrow: 1, overflow: "hidden" },
    sidebarWrapper:{ flexShrink: 0 },
    backdrop:      { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 1040 },
    mobileSidebar: { position: "fixed", top: 0, left: 0, height: "100%", zIndex: 1050, width: "240px", boxShadow: "4px 0 32px rgba(0,0,0,0.5)" },
    main:          { flexGrow: 1, padding: "1.5rem", overflowY: "auto", minWidth: 0, background: "var(--tf-bg)" },
};

export default MainLayout;
