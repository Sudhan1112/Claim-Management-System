// ProtectedRoute.jsx
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Auto-logout if token expired
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      }
    }
  }, [dispatch, token]);

  if (!token || !user) return <Navigate to="/login" replace />;
  
  try {
    const { role } = jwtDecode(token);
    if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
    return <Outlet />;
  } catch {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;