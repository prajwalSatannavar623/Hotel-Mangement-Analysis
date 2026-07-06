import Button from "../../components/Button.jsx";
import { useSelector } from "react-redux";

const Account = () => {
  const { user } = useSelector((state) => state.auth);

  console.log(user);
  return (
    <div className="w-full h-full p-5 text-text-main flex flex-col justify-between bg-app">
      <div className="flex flex-row gap-2">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName || "User avatar"}
            className="w-33 h-33 rounded-full shrink-0 border-2 border-border-subtle object-cover"
          />
        ) : (
          <div className="w-33 h-33 rounded-full shrink-0 border-2 border-border-subtle flex items-center justify-center bg-primary/10 text-primary font-bold text-8xl">
            {user.fullName?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <div className="flex flex-col bg-surface w-full p-3 rounded-3xl justify-center overflow-y-clip border-1 border-border-subtle">
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
      <Button variant="logout">Logout</Button>
    </div>
  );
};

export default Account;
