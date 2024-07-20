import { IoHome, IoCalendar  } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { GiTimeBomb } from "react-icons/gi";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";

export default function Sidebar() {
    return (
        <div className="nav_wrapper absolute bg-[#f4f4f4] p-[15px] drop-shadow-lg rounded-xl w-[20vw] h-[95vh] gap-[20px] grid grid-rows-[max-content_max-content_1fr_1fr_max-content] mx-[2.5vw] my-[2.5vh]">
            <div className="nav_section1 h-fit py-[10px] flex items-center gap-x-3">
                <div className="nav_logo w-[30px] h-[30px]"><GiTimeBomb className="w-full h-full"/></div>
                <div className="nav_title font-bold underline text-[20px] grow text-center underline-offset-2">Time Sync</div>
                <div className="nav_arrow self-center"><IoIosArrowBack /></div>
            </div>
            <div className="nav_section2 h-fit">
                <div className="hangoutBTN rounded-full m-auto bg-black text-white text-[13px] px-[25px] py-[5px] font-bold text-center w-fit">
                    <div className="inline text-[15px] h-full font-extrabold">+</div>
                    <div className="inline text-[15px] h-full"> New Hangout</div>
                </div>
            </div>
            <div className="nav_section3 flex flex-col gap-2 p-[10px]">
                <div className="nav_dash flex gap-3 items-center text-left h-fit">
                    <IoHome />
                    <div className="dash_title grow">Dashboard</div>
                </div>
                <div className="nav_view flex gap-3 items-center text-left h-fit">
                    <IoCalendar />
                    <div className="calendar_title grow">Calendar View</div>
                </div>
                <div className="nav_friends flex gap-3 items-center text-left h-fit">
                    <FaUserFriends />
                    <div className="friends_title grow">Friends</div>
                </div>
                <div className="nav_view flex gap-3 items-center text-left h-fit">
                    <GiPartyPopper />
                    <div className="calendar_title grow">Special Occasions</div>
                </div>
                {/* <div className="nav_view flex grow gap-3 items-center text-left">
                    <div className="calendar_title grow"></div>
                </div>
                <div className="nav_view flex grow gap-3 items-center text-left">
                    <div className="calendar_title grow"></div>
                </div>
                <div className="nav_view flex grow gap-3 items-center text-left">
                    <div className="calendar_title grow"></div>
                </div> */}

            </div>
            <div className="nav_section4 flex flex-col gap-[30px]">
                <div className="nav_preview flex flex-col gap-2">
                    <div className="preview1_options flex gap-1 items-center">
                        <div className="invite">Invitations</div> 
                        <div className="inviteNum">(4)</div>
                        <a className="viewAll grow underline underline-offset-2 text-right text-[10px]">View All</a>
                    </div>
                    <div className="preview1_show">
                        <img src="exampleInvite.png"></img>
                    </div>
                </div>
                <div className="nav_preview2 flex flex-col gap-2">
                    <div className="preview2_options flex gap-1 items-center">
                            <div className="invite">Upcoming</div> 
                            <div className="inviteNum">(8)</div>
                            <a className="viewAll grow underline underline-offset-2 text-right text-[10px]">View All</a>
                    </div>
                    <div className="preview2_show">
                        <img src="exampleUpcoming.png"></img>
                    </div>
                </div>
            </div>
            <div className="nav_section5 mt-[20px] flex items-center p-[10px]  bg-[#ededed] rounded-xl gap-3">
                <div className="nav_pfp w-fit rounded-full border-slate-500 border-2 overflow-hidden"><img className="w-[50px]" src="johnPfp.jpg"></img></div>
                <div className="nav_profileBio grow flex flex-col text-left">
                    <div className="profile_name">John Li</div>
                    <div className="profile_displayData">@teto</div>
                </div>
                <div className="nav_settings h-[30px]">
                    <MdOutlineSettingsSuggest className="w-full h-full"/>
                </div>
            </div>
        </div>
    );
}

// Home Link
    // Dashboard
// Day/Week/Month/Year View
// Events
// Notifications / Reminders
// Birthdays/Holidays
// Friends system - for Veeruuu
    // API endpoint for requesting friend’s schedule
    // Implement own data structure
    // Collection relationship 
    // Person A, Person B
// Notepad
// Profile Pic / User Profile Settings




















