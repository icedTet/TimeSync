import { useRef, useState } from "react";
import { useSelf } from "../../utils/ClientsideHelpers/useSelf";
import { GivenUser } from "../../utils/types/user";
import { useRouter } from "next/router";
import { SelfUserClass } from "../../utils/classes/UserClass";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserProfile } from "../user/UserProfile";
import { UpdateProfileModal } from "./UpdateProfileModal";

export const UserInfo = (props: { user: GivenUser }) => {
  const user = useSelf(props.user);
  const [pfpFile, setPfpFile] = useState(null as File | null);
  const [croppedPFP, setCroppedPFP] = useState(null as File | null);
  const [pfpUrl, setPfpUrl] = useState(user?.pfp);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);
  const [username, setUsername] = useState(user?.username);
  const [changed, setChanged] = useState(false);
  const [changing, setChanging] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const pfpinput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const revert = () => {
    setFirstName(user?.firstName);
    setLastName(user?.lastName);
    setEmail(user?.email);
    setUsername(user?.username);
    setPfpFile(null);
    setPfpUrl(user?.pfp);
    setChanged(false);
  };

  const update = async () => {
    if (changing) return;
    setChanging(true);
    if (pfpUrl?.startsWith("data")) {
      // upload the pfp
      const response = await fetch("/api/users/@me/updatePFP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64: pfpUrl,
        }),
      });
    }
    const response = await fetch("/api/users/@me/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      SelfUserClass.getInstance().user = data;
    }

    setChanging(false);
    setChanged(false);
    // router.rel
  };

  return (
    <div className={`flex flex-col gap-4 w-full`}>
      <input
        type="file"
        onChange={(e) => {
          setPfpFile(e.target.files?.[0]!);
          e.target.files = null;
        }}
        className={`hidden`}
        ref={pfpinput}
        accept="image/png, image/jpeg, image/jpg, image/gif"
      />
      <span
        className={`text-gray-900/40 uppercase font-bold font-poppins text-sm`}
      >
        About Me
      </span>
      <div
        className={`w-full bg-gray-50 dark:bg-gray-750 rounded-3xl flex flex-col border border-gray-900/10 overflow-hidden`}
      >
        <div className={`flex flex-col gap-4 border-b`}>
          <div
            className={`flex flex-row gap-4 items-center hover:bg-gray-900/5 p-6`}
            onClick={() => setEditMode(!editMode)}
          >
            <div
              className={`relative group cursor-pointer rounded-3xl w-16 h-16 flex-shrink-0 overflow-hidden shadow-md`}
            >
              <UserProfile
                user={user!}
                pfp={pfpUrl}
                className={`w-full h-full ${
                  editMode && pfpUrl === user?.pfp && `blur-sm`
                } transition-all rounded-3xl text-base`}
              />
              <div
                className={`flex flex-col gap-2 items-center justify-center absolute inset-0 bg-gray-900/30 rounded-3xl transition-all duration-150 ${
                  editMode
                    ? `opacity-100 pointer-events-auto`
                    : `opacity-0  pointer-events-none`
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  pfpinput.current?.click();
                }}
              >
                <PencilIcon className={`w-4 h-4 text-gray-50`} />
                {/* <span className={`text-sm font-medium`}></span> */}
              </div>
            </div>
            <div className={`flex flex-col gap-0.5 grow`}>
              <span className={`text-gray-900 font-bold text-lg`}>
                {user?.firstName} {user?.lastName}
              </span>
              <span className={`text-gray-900/50 text-sm`}>
                @{user?.username}
              </span>
            </div>
            <button className={``}>
              <ChevronRightIcon
                className={`w-4 h-4 ${
                  editMode ? `rotate-90` : ``
                } transition-all`}
              />
            </button>
          </div>
        </div>
        <div
          className={`flex flex-col gap-4 w-full py-0 px-6 ${
            editMode ? `max-h-96 py-6` : `max-h-0 overflow-hidden `
          } transition-all`}
        >
          <div className={`flex flex-row gap-4 w-full`}>
            <div className={`flex flex-col gap-0.5 grow`}>
              <span className={`inputlabel`}>First Name</span>
              <input
                type="text"
                className={`basicinput`}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setChanged(true);
                }}
                disabled={changing}
              />
            </div>
            <div className={`flex flex-col gap-0.5 grow`}>
              <span className={`inputlabel`}>Last Name</span>
              <input
                type="text"
                className={`basicinput`}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setChanged(true);
                }}
                disabled={changing}
              />
            </div>
          </div>
          <div className={`flex flex-row justify-end gap-4`}>
            <button
              className={`px-4 py-2 text-gray-600 rounded-2xl disabled:opacity-0 transition-all duration-150 hover:bg-gray-900 hover:text-gray-50`}
              disabled={!changed}
              onClick={revert}
            >
              Revert
            </button>
            <button
              className={`btn-primary`}
              disabled={!changed || changing}
              onClick={() => update()}
            >
              Save
            </button>
          </div>
        </div>

        {/* <div> */}
      </div>
      <UpdateProfileModal
        profilePicture={pfpFile}
        returnCroppedImage={(f) => {
          setPfpUrl(f);
          setPfpFile(null);
          setChanged(true);
        }}
        onCancel={() => {
          setPfpFile(null);
          setCroppedPFP(null);
        }}
      />
    </div>
  );
};
