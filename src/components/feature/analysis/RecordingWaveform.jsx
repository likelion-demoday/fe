// onSeek: 파형을 누른 위치의 비율(0~1)을 넘겨줌. 없으면 표시 전용
const RecordingWaveform = ({ levels, head = -1, activeColor = "#ff765b", inactiveColor = "#d9d9d9", onSeek }) => {
  const handleClick = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - left) / width)));
  };

  return (
    <div
      aria-hidden="true"
      onClick={onSeek && handleClick}
      className={`flex h-[183px] w-full items-center gap-[3px] ${onSeek ? "cursor-pointer" : ""}`}
    >
      {levels.map((level, index) => (
        <span
          key={index}
          className="w-[2.5px] shrink-0 rounded-[28px]"
          style={{
            height: `${Math.max(4, Math.min(183, level * 183 * 1.08))}px`,
            backgroundColor: index <= head ? activeColor : inactiveColor,
          }}
        />
      ))}
    </div>
  );
};

export default RecordingWaveform;
