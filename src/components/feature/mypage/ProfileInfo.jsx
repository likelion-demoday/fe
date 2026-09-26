import profileLarge from "../../../assets/icons/profile-large.svg";
import chevronRight from "../../../assets/icons/mypage-chevron-right.svg";
import Button from "../../common/Button";
const ProfileInfo = () => {
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
          <div className="text-title-semibold text-black">드라이브 가자잇</div>
        </div>
        <Button
          className="absolute top-0 right-0 flex cursor-pointer items-center gap-[8px] rounded-[6px] text-[#595959]"
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
          <dd className="text-heading">6일</dd>
        </div>
        <div className="flex items-center gap-[12px]">
          <dt className="text-caption">분석한 횟수</dt>
          <dd className="text-heading">3번</dd>
        </div>
        <div className="flex items-center gap-[12px]">
          <dt className="text-caption">녹음한 시간</dt>
          <dd className="text-heading">3시간23분</dd>
        </div>
      </dl>
    </div>
  );
};

export default ProfileInfo;
