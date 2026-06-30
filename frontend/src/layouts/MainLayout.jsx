import { useState } from "react";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const MainLayout = ({ children }) => {
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--tf-bg)" }}>

            <Navbar onToggleSidebar={() => setSidebarAbierto((prev) => !prev)} />

            <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>

                {/* Sidebar desktop */}
                <div className="d-none d-md-flex" style={{ flexShrink: 0 }}>
                    <Sidebar />
                </div>

                {/* Sidebar móvil offcanvas */}
                {sidebarAbierto && (
                    <>
                        <div
                            onClick={() => setSidebarAbierto(false)}
                            style={{
                                position: "fixed", inset: 0,
                                background: "rgba(0,0,0,0.7)",
                                backdropFilter: "blur(4px)",
                                zIndex: 1040
                            }}
                        />
                        <div style={{
                            position: "fixed", top: 0, left: 0, height: "100%",
                            zIndex: 1050, width: "240px",
                            boxShadow: "4px 0 32px rgba(0,0,0,0.5)"
                        }}>
                            <Sidebar onClose={() => setSidebarAbierto(false)} />
                        </div>
                    </>
                )}

                {/* Contenido principal */}
                <main style={{
                    flexGrow: 1, padding: "1.5rem",
                    overflowY: "auto", minWidth: 0,
                    background: "var(--tf-bg)"
                }}>
                    {children}
                </main>

            </div>

            <Footer />
        </div>
    );
};

export default MainLayout;
