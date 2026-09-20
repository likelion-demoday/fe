import TextField from "../../common/TextField";
import clearIcon from "../../../assets/icons/clear.svg";

const EmailInput = ({ value, onChange, onClear }) => {
  return (
    <TextField
      id="email"
      label="이메일"
      type="email"
      value={value}
      onChange={onChange}
      placeholder="이메일을 입력해주세요."
      trailing={
        value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="이메일 지우기"
            className="relative size-[16px] shrink-0 overflow-clip"
          >
            <img src={clearIcon} alt="" className="block size-full max-w-none" />
          </button>
        ) : null
      }
    />
  );
};

export default EmailInput;
