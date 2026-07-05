const Input = ({
  onChange = () => {},
  label,
  value,
  type = "text",
  className = "",
  name,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      {label && (
        <div className="w-1/2">
          <label htmlFor={name} className="font-medium">
            {label}
          </label>
        </div>
      )}
      <input
        value={value}
        type={type}
        id={name}
        className={`hover:cursor-pointer px-3 py-2 border border-secondary-dark rounded outline-primary text-text-main ${className}`}
        {...props}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Input;
