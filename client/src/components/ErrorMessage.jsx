const ErrorMessage = ({ children }) => {
  return (
    <div className="px-3 py-2 border border-error rounded bg-app">
      <p className="text-error text-base">{children}</p>
    </div>
  );
};

export default ErrorMessage;
