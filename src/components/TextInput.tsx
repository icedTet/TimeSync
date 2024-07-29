import { useRef } from "react";

export interface TextInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  placeholder: string;
  subLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id: string;
  name: string;
  autoComplete?: string;
}

export const TextInput = ({
  label,
  type,
  value,
  onChange,
  icon,
  placeholder,
  required,
  disabled,
  className,
  id,
  name,
  autoComplete,
  subLabel,
}: TextInputProps) => {
  const Icon = icon;
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={`flex flex-col gap-1 z-0 relative p-0 items-center w-full`}>
      <div
        className={`flex flex-row gap-4 w-full justify-between items-center`}
        onClick={() => {}}
      >
        <span className={`text-gray-900/40 text-sm font-wsans font-medium`}>
          {label} {required && <span className={`text-red-500`}>*</span>}
        </span>
      </div>
      <div
        className={`bg-gray-50 p-0 rounded-2xl border border-gray-900/10 flex flex-col w-full overflow-hidden px-4 py-4`}
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        <div className={`flex flex-row gap-4 items-center justify-start`}>
          <div className={`relative`}>
            <div className={`absolute bottom-1 right-1 p-1`}></div>
          </div>
          <input
            className={`text-gray-900/80 text-sm font-wsans font-medium border-none !outline-none bg-transparent w-full`}
            value={value}
            onChange={(e) => onChange(e)}
            ref={inputRef}
            type={type}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            id={id}
            name={name}
            autoComplete={autoComplete}
          />
        </div>
      </div>
      {subLabel && <span
        className={`text-gray-900/20 text-xs font-wsans font-medium w-full`}
      >
        {subLabel}
      </span>}
    </div>
  );
};
