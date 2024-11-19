// components/ui/alert.jsx
import React from 'react';
import { 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  XCircle,
  X
} from 'lucide-react';

const variants = {
  default: 'bg-gray-50 text-gray-900 border-gray-200',
  success: 'bg-green-50 text-green-900 border-green-200',
  error: 'bg-red-50 text-red-900 border-red-200',
  warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  info: 'bg-blue-50 text-blue-900 border-blue-200'
};

const icons = {
  default: AlertCircle,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

export function Alert({ 
  className, 
  variant = "default", 
  icon, 
  dismissible = false,
  onDismiss,
  children,
  ...props 
}) {
  const IconComponent = icon || icons[variant];

  return (
    <div
      role="alert"
      className={`
        relative w-full rounded-lg border p-4
        transition-all duration-200 ease-in-out
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start gap-4">
        {IconComponent && (
          <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          {children}
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className={`
              inline-flex h-6 w-6 items-center justify-center rounded-md
              hover:bg-gray-900/5 transition-colors
              ${variant === 'default' ? 'text-gray-500' : ''}
              ${variant === 'success' ? 'text-green-500' : ''}
              ${variant === 'error' ? 'text-red-500' : ''}
              ${variant === 'warning' ? 'text-yellow-500' : ''}
              ${variant === 'info' ? 'text-blue-500' : ''}
            `}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function AlertTitle({ className, ...props }) {
  return (
    <h5
      className={`
        mb-1 font-medium leading-none tracking-tight
        ${className}
      `}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }) {
  return (
    <div
      className={`
        text-sm opacity-90 [&_p]:leading-relaxed
        ${className}
      `}
      {...props}
    />
  );
}