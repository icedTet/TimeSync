import { ReactNode } from "react";

export const ListParent = (props: { children: ReactNode
    className?: string;
 }) => {
  return <div className={`bg-gray-50 p-0 rounded-2xl border border-gray-900/10 flex flex-col overflow-hidden`}>{props.children}</div>;
};
export default ListParent;