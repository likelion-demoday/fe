// 디자인: 채워진 막대 끝보다 약 2% 앞에서 연한 배경 막대가 시작해 막대 끝까지 이어짐
const TRACK_OVERLAP = 2.05;

const clampPercent = (value) => Math.min(100, Math.max(0, value));

// 나: 왼쪽에서 오른쪽으로 채움 (주황)
const MyBar = ({ value }) => {
  const fill = clampPercent(value);
  return (
    <div className="relative h-[12px] w-full drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)]">
      <div
        className="absolute inset-y-0 right-0 rounded-r-[8px] bg-gradient-to-r from-white to-[#fff1ef] to-[58.173%]"
        style={{ left: `${Math.max(0, fill - TRACK_OVERLAP)}%` }}
      />
      <div
        className="absolute inset-y-0 left-0 rounded-[35px] bg-gradient-to-r from-[#ffe2d8] to-[#ff8d77]"
        style={{ width: `${fill}%` }}
      />
    </div>
  );
};

// 상대: 오른쪽에서 왼쪽으로 채움 (파랑)
const PartnerBar = ({ value }) => {
  const fill = clampPercent(value);
  return (
    <div className="relative h-[12px] w-full drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)]">
      <div
        className="absolute inset-y-0 left-0 rounded-l-[8px] bg-gradient-to-l from-white to-[#f0f4ff] to-[58.173%]"
        style={{ right: `${Math.max(0, fill - TRACK_OVERLAP)}%` }}
      />
      <div
        className="absolute inset-y-0 right-0 rounded-[35px] bg-gradient-to-l from-[#c3d0ff] to-[#6d8cff]"
        style={{ width: `${fill}%` }}
      />
    </div>
  );
};

const LABEL = "font-['SUIT',sans-serif] text-[16px] font-bold tracking-[-0.32px] whitespace-nowrap";

/**
 * 두 사람의 점수를 마주 보는 막대로 비교
 * @param scores [{ label, me, partner }] 값은 0~100
 */
const ScoreCompareBars = ({ scores, speakers }) => (
  <div className="flex w-full flex-col gap-[16px] overflow-clip rounded-[24px] border border-[#eee] bg-white p-[20px] shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]">
    {scores.map(({ label, me, partner }) => (
      <div key={label} className="flex w-full flex-col gap-[8px]">
        <p className={`${LABEL} text-[#262626]`}>{label}</p>
        <div className="flex w-full flex-col gap-[4px]">
          <div className="flex w-full flex-col">
            <p className={`${LABEL} text-[#ff765b]`}>
              {speakers.me.nickname} {me}%
            </p>
            <MyBar value={me} />
          </div>
          <div className="flex w-full flex-col">
            <PartnerBar value={partner} />
            <p className={`${LABEL} self-end text-[#6d8cff]`}>
              {partner}% {speakers.partner.nickname}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ScoreCompareBars;
