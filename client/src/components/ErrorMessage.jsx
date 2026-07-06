const ErrorMessage = ({ children }) => {
  return (
    <div className="px-3 py-2 border border-error rounded bg-app flex justify-center items-center">
      <p className="text-error text-base text-center">{children}</p>
    </div>
  );
};

export default ErrorMessage;
