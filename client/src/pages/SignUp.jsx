import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";

import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LodingState from "../components/LodingState.jsx";

import { apiClient } from "../api/axios.client.js";
import { setCredentials } from "../slices/authSlice.js";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Handling url errors:
  const urlErrorKey = searchParams.get("error");
  const errorMessages = {
    GoogleAuthFailed: "Google authentication failed. Please try again.",
    Unauthorized: "We couldn't verify your Google account. Please try again.",
    SessionCreationFailed:
      "Failed to establish a secure session. Please sign in again.",
  };

  const urlErrorMessage = urlErrorKey
    ? errorMessages[urlErrorKey] ||
      "An unexpected error occurred during sign-in."
    : null;

  const displayError = error || urlErrorMessage;

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsloading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
        fullName,
      });

      if (response.data.success) {
        // set values to authStore
        dispatch(
          setCredentials({
            user: response.data.user,
          }),
        );

        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        const backendErrorMessage =
          error.response?.data?.message || "Internal server error";

        setError(backendErrorMessage);
      } else if (error.request) {
        setError("No response from server. Check your internet connection.");
      } else {
        setError("Request setup failed.");
      }
    } finally {
      setIsloading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 w-full h-screen bg-app text-text-main">
        <h1 className="text-heading font-bold"> Sign Up </h1>
        {error && <ErrorMessage>{displayError}</ErrorMessage>}
        {isLoading && <LodingState>Signing up</LodingState>}
        <form
          className="w-full flex flex-col justify-center items-center gap-2"
          onSubmit={handleFormSubmit}
        >
          <Input
            label={"Full name"}
            name={"fullName"}
            type="text"
            value={fullName}
            onChange={setFullName}
            placeholder="Full name"
            className="w-1/2"
          ></Input>

          <Input
            label={"Email"}
            name={"email"}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Email"
            className="w-1/2"
          ></Input>

          <Input
            label={"Password"}
            name={"password"}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Password"
            className="w-1/2"
          ></Input>

          <Button type="submit" variant="secondary" className="w-1/2">
            Continue
          </Button>
        </form>
        <Button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-1/2 relative"
        >
          <FcGoogle className="text-2xl absolute left-4" />
          <span>Signup with Google</span>
        </Button>
        <p className="text-text-muted text-tiny">
          Already have an account?{" "}
          <Link
            to={"/signin"}
            className="text-primary hover:text-primary-dark underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </>
  );
};

export default SignUp;
