import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const googleSignUp = () => {};

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 w-full h-screen bg-app text-text-main">
        <h1 className="text-heading font-bold"> Sign Up </h1>
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
          ></Input>

          <Input
            label={"password"}
            name={"password"}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Password"
            className="w-1/2"
          ></Input>

          <Button type="submit" variant="secondary" className="w-1/2">
            Continue to Signup
          </Button>
        </form>
        <Button type="button" onClick={googleSignUp} className="w-1/2 relative">
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
