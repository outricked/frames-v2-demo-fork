import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isLoading?: boolean;
}

export function Input({
  label,
  className = "",
  isLoading = false,
  disabled,
  ...props
}: InputProps) {
  return (
    <div className="w-full max-w-xs mx-auto block">
      {label && (
        <label className="block mb-2 text-gray-700 font-medium" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full bg-white border ${
            disabled ? "border-gray-300" : "border-[#7C65C1]"
          } text-gray-900 py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C65C1] disabled:opacity-50 disabled:cursor-not-allowed ${
            isLoading ? "pr-12" : ""
          } ${className}`}
          disabled={disabled || isLoading}
          {...props}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}