import { Link } from "react-router-dom";
import Button from "../../common/Button";
import chevronRight from "../../../assets/icons/mypage-chevron-right.svg";

const SavedConversationItem = ({
  date,
  durationMinutes,
  title,
  statusLabel,
  to,
  onClick,
}) => {
  const className =
    "mypage-press-row mypage-press-padded flex w-full cursor-pointer items-center justify-between text-left text-[#262626]";
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
        <img src={chevronRight} alt="" className="shrink-0" />
      )}
    </>
  );

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
