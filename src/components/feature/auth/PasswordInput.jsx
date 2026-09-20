import { useState } from "react";

import TextField from "../../common/TextField";
import eyeOpenIcon from "../../../assets/icons/eye-open.svg";
import eyeClosedIcon from "../../../assets/icons/eye-closed.svg";

const PasswordInput = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      id="password"
      label="비밀번호"
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder="비밀번호를 입력해주세요."
      helperText="8자 이상으로 입력해주세요."
      trailing={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
          className="relative size-[20px] shrink-0"
        >
          <img src={visible ? eyeOpenIcon : eyeClosedIcon} alt="" className="absolute inset-0 block size-full max-w-none" />
        </button>
      }
    />
  );
};

export default PasswordInput;
