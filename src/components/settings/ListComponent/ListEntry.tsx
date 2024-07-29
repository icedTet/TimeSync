import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const ListEntry = (props: {
  children?: React.ReactNode;
  toLink?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  disabled?: boolean;
}) => {
  if (props.toLink) {
    return (
      <Link href={props.toLink}>
        <div
          className={`bg-gray-50 p-1 rounded-2xl border-b last:border-none border-gray-900/10 flex flex-row items-center justify-between cursor-pointer ${
            props.className
          } ${props.disabled ? "pointer-events-none opacity-20" : ""} text-sm font-medium font-wsans px-6 py-4`}
          onClick={props.onClick}
        >
          {props.children}
          <ChevronRightIcon className={`h-4 w-4`} />
        </div>
      </Link>
    );
  }

  return (
    <div
      className={`bg-gray-50 p-1 rounded-2xl border-b last:border-none border-gray-900/10 flex flex-row items-center justify-between cursor-pointer ${
        props.className
      } ${props.disabled ? "pointer-events-none opacity-20" : ""} text-sm font-medium font-wsans  px-6 py-4`}
      onClick={props.onClick}
    >
     {props.children}
    </div>
  );
};
