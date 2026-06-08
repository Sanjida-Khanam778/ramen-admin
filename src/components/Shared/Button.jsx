const Button = ({ children, className = "" }) => {
  return (
    <button
      className={`
        px-6 py-2 rounded-lg font-medium text-white
        bg-gradient-to-r from-[#0E4269] via-[#00B5CA] to-[#FECB2C]
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
