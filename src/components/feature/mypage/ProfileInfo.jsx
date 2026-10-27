import profileLarge from "../../../assets/icons/profile-large.svg";
import chevronRight from "../../../assets/icons/mypage-chevron-right.svg";
import Button from "../../common/Button";
const ProfileInfo = ({ nickname, joinedDays, analysisCount, totalRecordingSeconds }) => {
  const totalMinutes = Math.floor(totalRecordingSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return (
    <div className="flex flex-col gap-[46px]">
      <header className="relative flex justify-center">
        <div className="flex flex-col items-center gap-[30px]">
          <div className="relative size-[97px] shrink-0">
            <img
              src={profileLarge}
              alt=""
              className="pointer-events-none absolute -top-[116px] -left-[116px] max-w-none"
            />
          </div>
          <div className="text-title-semibold text-black">{nickname}</div>
        </div>
        <Button
          className="active:bg-[#eeeeee] absolute top-0 right-0 flex cursor-pointer items-center gap-[8px] rounded-[6px] text-[#595959]"
          text={
            <>
              <span className="text-body">수정하기</span>
              <img src={chevronRight} alt="" className="shrink-0" />
            </>
          }
        />
      </header>
      <dl className="flex flex-col items-center gap-[20px] text-black">
        <div className="flex items-center gap-[12px]">
          <dt className="text-caption">가입 기간</dt>
          <dd className="text-heading">{joinedDays.toLocaleString("ko-KR")}일</dd>
        </div>
        <div className="flex items-center gap-[12px]">
          <dt className="text-caption">분석한 횟수</dt>
          <dd className="text-heading">{analysisCount.toLocaleString("ko-KR")}번</dd>
        </div>
        <div className="flex items-center gap-[12px]">
          <dt className="text-caption">녹음한 시간</dt>
          <dd className="text-heading">{hours > 0 ? `${hours.toLocaleString("ko-KR")}시간` : ""}{minutes}분</dd>
        </div>
      </dl>
    </div>
  );
};

export default ProfileInfo;
