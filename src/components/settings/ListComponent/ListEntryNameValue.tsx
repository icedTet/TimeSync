import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const ListEntryNameValue = (props: {
  name: string;
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
          className={`bg-gray-50 p-1 rounded-none border-b last:border-none border-gray-900/5 flex flex-row items-center justify-between cursor-pointer ${
            props.className
          } ${
            props.disabled ? "pointer-events-none opacity-20" : ""
          } text-sm font-medium font-wsans px-6 py-3  text-gray-900/40`}
          onClick={props.onClick}
        >
          <div className={`flex flex-row gap-4 items-center justify-between`}>
            <span className={`text-gray-900/80 text-sm font-wsans font-medium`}>
              {props.name}
            </span>
          </div>
          {props.children}
          <ChevronRightIcon className={`h-4 w-4`} />
        </div>
      </Link>
    );
  }

  return (
    <div
      className={`bg-gray-50 p-1 rounded-none border-b last:border-none border-gray-900/5 flex flex-row items-center justify-between cursor-pointer ${
        props.className
      } ${
        props.disabled ? "pointer-events-none opacity-20" : ""
      } text-sm font-medium font-wsans  px-6 py-3 text-gray-900/40`}
      onClick={props.onClick}
    >
      <div className={`flex flex-row gap-4 items-center justify-between`}>
        <span className={`text-gray-900/80 text-sm font-wsans font-medium`}>
          {props.name}
        </span>
      </div>
      {props.children}
    </div>
  );
};
