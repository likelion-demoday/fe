import TextField from "../../common/TextField";
import clearIcon from "../../../assets/icons/clear.svg";
import { isValidEmail } from "../../../utils/validation";

// error: 형식 외 에러(예: 이미 사용중인 이메일)를 외부에서 지정할 때 사용
// validate: false면 형식 검사 에러를 표시하지 않음 (로그인 화면)
const EmailInput = ({ value, onChange, onClear, error = false, validate = true }) => {
  const isError = error || (validate && value.length > 0 && !isValidEmail(value));

  return (
    <TextField
      id="email"
      label="이메일"
      type="email"
      value={value}
      onChange={onChange}
      placeholder="이메일을 입력해주세요."
      helperText={isError ? "이미 사용중인 이메일이거나 형식이 올바르지 않아요." : null}
      error={isError}
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
