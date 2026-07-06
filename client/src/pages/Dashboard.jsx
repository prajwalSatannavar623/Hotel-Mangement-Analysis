import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

import { toggleTheme } from "../slices/themeSlice.js";

const Dashboard = () => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const getNavStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary/10 text-primary border-l-4 border-secondary shadow-sm"
        : "text-text-muted hover:bg-elevated hover:text-text-main"
    }`;

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  return (
    <div className="flex bg-app w-full min-h-screen text-text-main font-regular">
      {/* Aside */}
      <aside className="w-64 shrink-0 bg-surface border-r border-border-subtle flex flex-col justify-between sticky top-0 h-screen">
        {/* Brand name and Logo */}
        <div className="flex flex-col">
          {/* Brand Logo Header */}
          <div className="h-16 px-6 flex items-center gap-2 border-b border-border-subtle">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-text-inverse font-bold text-large shadow-md">
              H
            </div>
            <span className="text-large font-bold tracking-tight">
              Hotelyzis
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 p-4">
            <p className="px-4 py-2 text-tiny font-bold uppercase tracking-wider text-text-muted">
              Menu
            </p>

            <NavLink to="/dashboard" end className={getNavStyle}>
              <span>Analyse</span>
            </NavLink>

            <NavLink to="/dashboard/history" end className={getNavStyle}>
              <span>History</span>
            </NavLink>

            <NavLink to="/dashboard/account" end className={getNavStyle}>
              <span>Account</span>
            </NavLink>
          </nav>
        </div>

        {/* Profile overview */}
        <div className="p-4 border-t border-border-subtle">
          <div className="p-3 rounded-xl bg-elevated flex items-center gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={"A"}
                className="w-10 h-10 rounded-full border border-secondary flex items-center justify-center text-secondary font-bold object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-light/20 border border-secondary flex items-center justify-center text-text-main font-bold">
                {user.fullName?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">
                {user.fullName}
              </span>
              <span className="text-tiny text-text-muted truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-col flex-1 min-w-0 bg-app">
        <header className="h-16 px-8 bg-surface/80 backdrop-blur-md border-b border-border-subtle flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-large font-bold">Dashboard</h1>
            <span className="text-text-muted text-sm">/ Overview</span>
          </div>

          {/* Theme Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleThemeToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-text-main
               border border-border-subtle text-text-inverse text-sm hover:cursor-pointer font-medium"
            >
              {theme === "dark" ? <CiLight /> : <MdDarkMode />}
            </button>
          </div>
        </header>

        {/* Dynamic Page Content (Outlet) */}
        <div className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
