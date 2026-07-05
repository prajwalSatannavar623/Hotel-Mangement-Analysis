const LodingState = ({ children }) => {
  return (
    <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
      <div className="w-30 h-30 rounded-full border-4 border-t-primary animate-spin absolute"></div>
      <span className="text-medium font-bold text-pink-600 text-center ">
        {children}
        <br />
        <span className="text-tiny">Please wait ...</span>
      </span>
    </div>
  );
};

export default LodingState;
