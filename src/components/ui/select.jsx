// components/ui/select.jsx
import React, { createContext, useContext, useState } from 'react';
import { Check } from 'lucide-react';

const SelectContext = createContext({});

export function Select({ children, value, onValueChange, ...props }) {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen } = useContext(SelectContext);
  
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`
        flex h-10 w-full items-center justify-between rounded-md border border-gray-200 
        bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-950 
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder, ...props }) {
  const { value } = useContext(SelectContext);
  
  return (
    <span className="text-sm truncate">
      {value || placeholder}
    </span>
  );
}

export function SelectContent({ className, children, ...props }) {
  const { open, setOpen } = useContext(SelectContext);
  
  if (!open) return null;
  
  return (
    <div
      className={`
        absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white 
        text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95
        ${className}
      `}
      {...props}
    >
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">
        {children}
      </div>
    </div>
  );
}

export function SelectItem({ className, children, value, ...props }) {
  const { value: selectedValue, onValueChange, setOpen } = useContext(SelectContext);
  
  const isSelected = selectedValue === value;
  
  const handleClick = () => {
    onValueChange(value);
    setOpen(false);
  };
  
  return (
    <div
      className={`
        relative flex w-full cursor-pointer select-none items-center rounded-sm 
        py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100
        ${isSelected ? 'bg-gray-100' : ''}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
      {children}
    </div>
  );
}