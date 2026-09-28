import { Link } from "react-router-dom";
import Button from "../../common/Button";
import chevronRight from "../../../assets/icons/mypage-chevron-right.svg";

const SavedConversationItem = ({
  date,
  durationMinutes,
  title,
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
      </span>
      <img src={chevronRight} alt="" className="shrink-0" />
    </>
  );

  if (to)
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  return <Button text={content} onClick={onClick} className={className} />;
};

export default SavedConversationItem;
