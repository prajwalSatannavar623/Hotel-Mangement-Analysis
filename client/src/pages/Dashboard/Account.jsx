import Button from "../../components/Button.jsx";
import { useSelector, useDispatch } from "react-redux";

import { apiClient } from "../../api/axios.client.js";
import { useState } from "react";

import { logoutUser } from "../../slices/authSlice.js";

import LodingState from "../../components/LodingState.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";

const Account = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsloggingout] = useState(false);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setShowConfirmModal(false);
    setError(null);
    setIsloggingout(true);

    try {
      const response = await apiClient.post("/auth/logout");

      if (response.data?.success) {
        dispatch(logoutUser());
      }
    } catch (error) {
      if (error.response) {
        const backendErrorMessage =
          error.response?.data?.message || "Internal server error";

        setError(backendErrorMessage);
      } else if (error.request) {
        setError("No response from server. Check your internet connection.");
      } else {
        setError("Request setup failed");
      }
    } finally {
      setIsloggingout(false);
    }
  };

  return (
    <div className="w-full h-full p-5 text-text-main flex flex-col justify-between bg-app">
      {isLoggingOut && <LodingState>Logging out</LodingState>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="flex flex-row gap-2">
        {user.avatarUrl && !imgError ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName || "User avatar"}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-33 h-33 rounded-full shrink-0 border-2 border-border-subtle object-cover"
          />
        ) : (
          <div className="w-33 h-33 rounded-full shrink-0 border-2 border-border-subtle flex items-center justify-center bg-primary/10 text-primary font-bold text-6xl">
            {user.fullName?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <div className="flex flex-col bg-surface w-full p-3 rounded-3xl justify-center overflow-y-clip border-2 border-border-subtle">
          <p className="text-heading font-bold">{user.fullName || "Guest"}</p>
          <p className="text-medium text-text-muted">
            <i>@ {user.email || "no email"}</i>
          </p>
          <p className="text-primary-light">
            email status:{" "}
            <span>
              {user.emailVerified ? (
                <span className="text-success text-tiny font-bold">
                  verified
                </span>
              ) : (
                <span className="text-error text-tiny font-bold">
                  not verified
                </span>
              )}
            </span>
          </p>
        </div>
      </div>
      <Button variant="logout" onClick={() => setShowConfirmModal(true)}>
        Logout
      </Button>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-surface border border-border-subtle p-6 rounded-2xl max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-error-subtle flex items-center justify-center text-error text-2xl font-bold">
              !
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-text-main">
                Confirm Logout
              </h3>
              <p className="text-sm text-text-muted">
                Are you sure you want to end your session and log out of
                Hotelyzis?
              </p>
            </div>

            <div className="flex items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-border-subtle bg-app hover:bg-elevated text-text-main text-sm font-semibold transition-colors cursor-pointer"
              >
                No, Stay
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-error hover:bg-error/90 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
