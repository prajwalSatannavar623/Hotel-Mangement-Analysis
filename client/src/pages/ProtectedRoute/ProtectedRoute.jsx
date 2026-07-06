import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LodingState from "../../components/LodingState.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useSelector(
    (state) => state.auth,
  );

  if (isInitializing) {
    return <LodingState>Refreshing...</LodingState>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
