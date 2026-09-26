import { Fragment } from "react";
import Button from "../../common/Button";
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
    { id: "profile", label: "프로필", icon: userIcon },
    { id: "notifications", label: "알림", icon: bellIcon },
  ],
  [
    { id: "payments", label: "이용권 • 결제", icon: handCashIcon },
    { id: "recordings", label: "녹음 • 기록 관리", icon: archiveIcon },
  ],
  [
    { id: "account", label: "계정", icon: userCircleIcon },
    { id: "support", label: "고객지원", icon: headsetHelpIcon },
  ],
];

const MyPageMenu = ({ onMenuSelect }) => {
  return (
    <nav className="flex flex-col gap-[20px]">
      {menuGroups.map((group, index) => (
        <Fragment key={group[0].id}>
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
            {group.map(({ id, label, icon }) => (
              <li key={id}>
                <Button
                  onClick={() => onMenuSelect?.(id)}
                  className="flex min-h-[30px] w-full cursor-pointer items-center justify-between text-left text-[#262626] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#595959]"
                  text={
                    <>
                      <span className="flex items-center gap-[17px]">
                        <img src={icon} alt="" className="shrink-0" />
                        <span className="text-label">{label}</span>
                      </span>
                      <span className="flex h-[13px] w-[8px] items-center justify-center">
                        <img src={chevronRightIcon} alt="" />
                      </span>
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </nav>
  );
};

export default MyPageMenu;
