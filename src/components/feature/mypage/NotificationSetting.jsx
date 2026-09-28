import Input from "../../common/Input";

const NotificationSetting = ({ label, checked, onChange }) => {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between py-[12px]">
      <span className="text-label text-[#262626]">{label}</span>
      <span className="relative h-[24px] w-[42px] shrink-0">
        <Input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer m-0 block h-[24px] w-[42px] cursor-pointer appearance-none rounded-[71px] bg-[#bfbfbf] checked:bg-[#454545] checked:shadow-[0_0_11.4px_rgba(0,0,0,0.05)]"
        />
        <span className="pointer-events-none absolute top-px left-px size-[22px] rounded-[71px] bg-[#fcfcfc] peer-checked:top-[2px] peer-checked:left-[20px] peer-checked:size-[20px]" />
      </span>
    </label>
  );
};

export default NotificationSetting;
