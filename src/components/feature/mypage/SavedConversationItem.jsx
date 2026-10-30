import { Link } from "react-router-dom";
import Button from "../../common/Button";
import chevronRight from "../../../assets/icons/mypage-chevron-right.svg";
import disabledChevronRight from "../../../assets/icons/mypage-chevron-right-disabled.svg";

const SavedConversationItem = ({
  date,
  durationMinutes,
  title,
  statusLabel,
  to,
  onClick,
  disabled = false,
}) => {
  const className =
    `flex w-full items-center justify-between text-left ${disabled ? "cursor-default text-[#bfbfbf]" : "mypage-press-row mypage-press-padded cursor-pointer text-[#262626]"}`;
  const content = (
    <>
      <span className="flex flex-col items-start justify-center gap-[4px]">
        <span className="text-title-semibold">
          {date} • {durationMinutes}분
        </span>
        <span className="text-body">{title}</span>
        {statusLabel && <span className="text-caption">{statusLabel}</span>}
      </span>
      {(to || onClick) && (
        <img src={disabled ? disabledChevronRight : chevronRight} alt="" className="h-[13px] w-[8px] shrink-0" />
      )}
    </>
  );

  if (disabled)
    return <Button text={content} disabled className={className} />;
  if (to)
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  if (onClick)
    return <Button text={content} onClick={onClick} className={className} />;
  return (
    <div className={className.replace("cursor-pointer", "cursor-default")}>
      {content}
    </div>
  );
};

export default SavedConversationItem;
