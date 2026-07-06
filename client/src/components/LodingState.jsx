// const LodingState = ({ children }) => {
//   return (
//     <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
//       <div className="w-30 h-30 rounded-full border-4 border-t-primary animate-spin absolute"></div>
//       <span className="text-medium font-bold text-pink-600 text-center ">
//         {children}
//         <br />
//         <span className="text-tiny">Please wait ...</span>
//       </span>
//     </div>
//   );
// };

// export default LodingState;

const LodingState = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-surface border border-border-subtle px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-xs w-full space-y-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center space-y-1">
          <h4 className="text-base font-bold text-text-main leading-snug">
            {children}
          </h4>
          <p className="text-xs font-medium text-text-muted animate-pulse">
            Please wait...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LodingState;
