import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { GivenUser, PublicUser } from "../../../utils/types/user";
import { UserProfile } from "../../user/UserProfile";

export const EventUserEntry = (props: {
  user: GivenUser | PublicUser | null;
  owner?: boolean;
  className?: string;
  onDelete?: () => void;
}) => {
  const { user, className, owner } = props;
  return (
    <div
      className={`flex flex-row gap-4 w-full ${
        owner && `opacity-50`
      } ${className} last:border-none border-b border-gray-900/5 px-4 py-4`}
    >
      <UserProfile
        user={user ?? undefined}
        className="rounded-full h-12 w-12 text-base shrink-0 grow-0"
      />
      <div className="flex flex-row w-full grow gap-4 items-center">
        <div className="flex flex-col w-full grow">
          <span className="text-gray-900/80 font-bold text-lg font-wsans flex flex-row items-center justify-between w-full">
            {user?.firstName} {user?.lastName}{" "}
            {owner && (
              <span className="text-gray-900/30 text-xs font-wsans font-normal">
                Owner
              </span>
            )}
          </span>
          <span className="text-gray-900/50 text-sm font-wsans">
            @{user?.username}
          </span>
        </div>
        {!owner && (
          <button className="flex flex-row items-center gap-2 border border-gray-900/10 hover:bg-red-400 group p-3 rounded-2xl transition-all"
            onClick={props.onDelete}
          >
            <TrashIcon className="w-5 h-5 text-gray-700 group-hover:text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export const UserSearchResult = (props: {
  user: GivenUser | PublicUser | null;
  className?: string;
  addUser: ()=>void;
}) => {
  const { user, className } = props;
  return (
    <div
      className={`flex flex-row gap-4 w-full ${className} last:border-none border-b border-gray-900/5 px-4 py-4`}
      onClick={props.addUser}
    >
      <UserProfile
        user={user ?? undefined}
        className="rounded-full h-10 w-10 text-sm shrink-0 grow-0"
      />
      <div className="flex flex-row w-full grow gap-2 items-center">
        <div className="flex flex-col w-full grow gap-0">
          <span className="text-gray-900/50 font-medium text-sm font-wsans flex flex-row items-center justify-between w-full leading-tight">
            {user?.firstName} {user?.lastName}{" "}
          </span>
          <span className="text-gray-900/30 text-xs font-wsans">
            @{user?.username}
          </span>
        </div>
        <button className="flex flex-row items-center gap-2 border border-gray-900/10 hover:bg-green-400 group p-2 h-fit rounded-2xl transition-all">
          <PlusIcon className="w-4 h-4 text-gray-700 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};
