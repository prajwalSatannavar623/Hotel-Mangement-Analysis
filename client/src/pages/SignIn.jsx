import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LodingState from "../components/LodingState.jsx";

import { apiClient } from "../api/axios.client.js";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsloading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/login", {
        email: email,
        password: password,
      });

      if (response?.data?.success) {
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

  const handleGoogleLogin = () => {};

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 w-full h-screen bg-app text-text-main">
        <h1 className="text-heading font-bold"> Login in to continue </h1>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isLoading && <LodingState>Signing in</LodingState>}
        <form
          className="w-full flex flex-col justify-center items-center gap-2"
          onSubmit={handleFormSubmit}
        >
          <Input
            label={"Email"}
            name={"email"}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Email"
            className="w-1/2"
            disabled={isLoading}
          ></Input>

          <Input
            label={"password"}
            name={"password"}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Password"
            className="w-1/2"
            disabled={isLoading}
          ></Input>

          <Button
            type="submit"
            variant="secondary"
            className="w-1/2"
            disabled={isLoading}
          >
            Sign in
          </Button>
        </form>
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-1/2 relative"
          disabled={isLoading}
        >
          <FcGoogle className="text-2xl absolute left-4" />
          <span>Sign in with Google</span>
        </Button>
        {!isLoading && (
          <p className="text-text-muted text-tiny">
            Don't have account?{" "}
            <Link
              to={"/signup"}
              className="text-primary hover:text-primary-dark underline"
            >
              Signup here
            </Link>
          </p>
        )}
      </div>
    </>
  );
};

export default SignIn;
