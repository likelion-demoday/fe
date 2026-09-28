import { Fragment } from "react";
import { Link } from "react-router-dom";
import userIcon from "../../../assets/icons/user.svg";
import bellIcon from "../../../assets/icons/bell.svg";
import handCashIcon from "../../../assets/icons/hand-cash.svg";
import archiveIcon from "../../../assets/icons/archive.svg";
import userCircleIcon from "../../../assets/icons/user-circle.svg";
import headsetHelpIcon from "../../../assets/icons/headset-help.svg";
import chevronRightIcon from "../../../assets/icons/mypage-chevron-right.svg";
import divider from "../../../assets/icons/mypage-divider.svg";

const menuGroups = [
  [
    { path: "/mypage/profile", label: "프로필", icon: userIcon },
    { path: "/mypage/notifications", label: "알림", icon: bellIcon },
  ],
  [
    { path: "/mypage/payments", label: "이용권 • 결제", icon: handCashIcon },
    {
      path: "/mypage/recordings",
      label: "녹음 • 기록 관리",
      icon: archiveIcon,
    },
  ],
  [
    { path: "/mypage/account", label: "계정", icon: userCircleIcon },
    { path: "/mypage/support", label: "고객지원", icon: headsetHelpIcon },
  ],
];

const MyPageMenu = () => {
  return (
    <nav className="flex flex-col gap-[20px]">
      {menuGroups.map((group, index) => (
        <Fragment key={group[0].path}>
          {index > 0 && (
            <div className="relative h-0">
              <img
                src={divider}
                alt=""
                className="absolute -top-[0.5px] left-1/2 -translate-x-1/2"
              />
            </div>
          )}
          <ul className="flex flex-col gap-[30px]">
            {group.map(({ path, label, icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="flex min-h-[30px] w-full cursor-pointer items-center justify-between text-left text-[#262626] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#595959]"
                >
                  <span className="flex items-center gap-[17px]">
                    <img src={icon} alt="" className="shrink-0" />
                    <span className="text-label">{label}</span>
                  </span>
                  <span className="flex h-[13px] w-[8px] items-center justify-center">
                    <img src={chevronRightIcon} alt="" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </nav>
  );
};

export default MyPageMenu;
