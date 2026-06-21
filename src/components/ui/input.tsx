import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => {
    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              placeholder:text-gray-400
              ${icon ? '!pl-10' : ''}
              ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
              ${className}`}
            {...props}
          />
        </div>
        {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
