import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";

const ProtectedRoute = () => {

    const connectSocket = useSocketStore((s) => s.connectSocket);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null;

    useEffect(() => {
        if (token && user?.id) {
            connectSocket();
        }
    }, []);

    if (!token || !user) {
        return <Navigate to="/register" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;