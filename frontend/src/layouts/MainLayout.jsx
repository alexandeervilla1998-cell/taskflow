import { useState } from "react";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const MainLayout = ({ children }) => {
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    return (
        <div className="d-flex flex-column min-vh-100">

            <Navbar onToggleSidebar={() => setSidebarAbierto((prev) => !prev)} />

            <div className="d-flex flex-grow-1" style={{ overflow: "hidden" }}>

                {/* Sidebar desktop */}
                <div className="d-none d-md-flex flex-shrink-0" style={{ width: "220px" }}>
                    <Sidebar />
                </div>

                {/* Sidebar móvil — offcanvas manual */}
                {sidebarAbierto && (
                    <>
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                            style={{ zIndex: 1040 }}
                            onClick={() => setSidebarAbierto(false)}
                        ></div>
                        <div
                            className="position-fixed top-0 start-0 h-100 bg-white shadow"
                            style={{ zIndex: 1050, width: "260px" }}
                        >
                            <Sidebar onClose={() => setSidebarAbierto(false)} />
                        </div>
                    </>
                )}

                <main className="flex-grow-1 p-3 p-md-4" style={{ overflowY: "auto", minWidth: 0 }}>
                    {children}
                </main>

            </div>

            <Footer />

        </div>
    );
};

export default MainLayout;
