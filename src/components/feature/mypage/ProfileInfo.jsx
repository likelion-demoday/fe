import profileLarge from "../../../assets/icons/profile-large.svg";
import chevronRight from "../../../assets/icons/mypage-chevron-right.svg";
import Button from "../../common/Button";
const ProfileInfo = ({ nickname, joinedDays, analysisCount, totalRecordingSeconds, onSaveNickname }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(nickname);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const input = useRef(null);
  const cancelEdit = () => {
    if (pending.current) return;
    setEditing(false);
    setError("");
  };
  const saveNickname = async () => {
    if (pending.current) return;
    const nextNickname = draft.trim();
    if (!nextNickname) {
      setError("닉네임을 입력해주세요.");
      input.current?.focus();
      return;
    }
    if (nextNickname === nickname) {
      cancelEdit();
      return;
    }
    pending.current = true;
    setSaving(true);
    setError("");
    try {
      await onSaveNickname(nextNickname);
      setEditing(false);
    } catch (error) {
      setError(error?.message || "닉네임을 변경하지 못했어요. 다시 시도해주세요.");
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };
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
          {editing ? (
            <div className="flex w-full max-w-[260px] flex-col items-center gap-[8px]">
              <input
                ref={(element) => {
                  input.current = element;
                  if (element) element.focus();
                }}
                aria-label="닉네임"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "nickname-error" : undefined}
                value={draft}
                disabled={saving}
                onChange={(event) => { setDraft(event.target.value); setError(""); }}
                onKeyDown={(event) => {
                  if (event.nativeEvent.isComposing) return;
                  if (event.key === "Enter") { event.preventDefault(); saveNickname(); }
                  if (event.key === "Escape") cancelEdit();
                }}
                className="text-title-semibold w-full border-0 border-b border-[#ff765b] bg-transparent px-0 py-[4px] text-center text-black outline-none"
              />
              {error && <p id="nickname-error" role="alert" className="text-caption text-center text-red-600">{error}</p>}
            </div>
          ) : <div className="text-title-semibold text-black">{nickname}</div>}
        </div>
        <div className="absolute top-0 right-0 flex gap-[20px]">
        {editing && <Button text="취소" onClick={cancelEdit} disabled={saving} className="text-body cursor-pointer rounded-[6px] text-[#ff765b] active:bg-[#eeeeee] disabled:cursor-wait" />}
        <Button
          onClick={editing ? saveNickname : () => { setDraft(nickname); setError(""); setEditing(true); }}
          disabled={saving}
          className={`active:bg-[#eeeeee] flex cursor-pointer items-center gap-[8px] rounded-[6px] disabled:cursor-wait ${editing ? "text-[#ff765b]" : "text-[#595959]"}`}
          text={
            <>
              <span className="text-body">{saving ? "저장 중..." : editing ? "저장" : "수정하기"}</span>
              {!editing && <img src={chevronRight} alt="" className="shrink-0" />}
            </>
          }
        />
        </div>
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
import { useRef, useState } from "react";
