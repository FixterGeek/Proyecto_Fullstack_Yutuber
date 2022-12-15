import { type ReactNode } from 'react';
import Spinner from './Spinner';

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'main' | 'outline';
  type?: 'button' | 'submit';
  className?: string;
  isLoading?: boolean;
}
export default function Button({
  variant = 'main',
  onClick,
  children,
  type = 'button',
  className: classname,
  isLoading,
}: ButtonProps) {
  const className =
    variant === 'main'
      ? 'text-blue-100 bg-blue-500 text-xl p-4 rounded-r-xl hover:bg-blue-700 transition-all disabled:bg-bg-blue-100 flex justify-center'
      : 'p-4 border border-blue-500 w-32 rounded bg-blue-300 disabled:bg-bg-blue-100 flex justify-center';

  return (
    <button
      disabled={isLoading}
      type={type}
      onClick={onClick}
      className={className + ' ' + classname}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
