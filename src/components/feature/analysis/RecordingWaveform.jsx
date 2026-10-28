const RecordingWaveform = ({ levels, head = -1, activeColor = "#ff765b", inactiveColor = "#d9d9d9" }) => (
  <div aria-hidden="true" className="flex h-[183px] w-full items-center gap-[3px]">
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

export default RecordingWaveform;
