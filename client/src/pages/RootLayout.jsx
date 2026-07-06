// components/RootLayout.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { apiClient } from "../api/axios.client.js";
import { setCredentials, logoutUser } from "../slices/authSlice.js";

const RootLayout = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        if (response.data?.success) {
          dispatch(setCredentials(response.data.data.user));
        }
      } catch (error) {
        // If no valid session cookie exists, ensure auth state is reset
        dispatch(logoutUser());
        console.log("User is not authenticated");
        console.error(error);
      }
    };

    restoreSession();
  }, [dispatch]);

  return <Outlet />;
};

export default RootLayout;
