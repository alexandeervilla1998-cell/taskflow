import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">

            <Navbar />

            <div className="container-fluid flex-grow-1">
                <div className="row">

                    <aside className="col-md-2 bg-light border-end p-0">
                        <Sidebar />
                    </aside>

                    <main className="col-md-10 p-4">
                        {children}
                    </main>

                </div>
            </div>

            <Footer />

        </div>
    );
};

export default MainLayout;