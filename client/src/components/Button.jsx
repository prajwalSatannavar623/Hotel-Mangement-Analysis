import { Link } from "react-router-dom";

const Button = ({
  to,
  type = "button",
  onClick = () => {},
  className = "",
  children,
  variant = "basic",
  ...props
}) => {
  const baseClass =
    "px-4 py-2 text-text-medium font-medium transition-all duration-200 rounded hover:cursor-pointer active:scale-90";

  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-static-white",
    secondary: "bg-secondary hover:bg-secondary-dark text-static-white",
    outline: "bg-static-black text-static-white hover:bg-black/85",
    basic: "bg-static-white text-static-black border border-static-muted",
  };

  if (to && type !== "submit") {
    return (
      <Link
        to={to}
        className={`${baseClass} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`${baseClass} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
