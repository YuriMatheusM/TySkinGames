import { useState } from "react";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 px-4 rounded-3xl bg-gray-700 focus:outline-none"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-2 text-gray-300 hover:text-white cursor-pointer"
        tabIndex={-1}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  );
};

export default PasswordInput;
