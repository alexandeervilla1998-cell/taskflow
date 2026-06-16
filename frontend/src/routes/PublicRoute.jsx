import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {

    const isAuthenticated = false;

    return isAuthenticated
        ? <Navigate to="/" replace />
        : children;
};

export default PublicRoute;