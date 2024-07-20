import Link from "next/link";
import { useRouter } from "next/router";

export const NavLink = (props: {
  href: string;
  className?: string;
  name: string;
  icon: (props: { className: string }) => JSX.Element;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  const { href, className, name, onClick, children, icon: Icon } = props;
  const router = useRouter();
  const isActive = router.pathname.startsWith(href);

  return (
    <Link href={href}>
      <button
        className={`flex flex-col items-center justify-center h-12 w-12 hover:text-gray-900 ${
          className ? className : ""
        } ${isActive ? "bg-gray-900/5 scale-125" : " text-gray-600"} rounded-xl relative group transition-all`}
        onClick={onClick}
      >
        <Icon className={`h-6 w-6 `} />
        <span className="text-xs font-wsans text-gray-400 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+0.5rem)] px-4 py-2 bg-gray-900 rounded-lg scale-0 group-hover:scale-100 origin-bottom transition-all ">
          {name}
        </span>
      </button>
    </Link>
  );
};
