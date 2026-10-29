import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadRecording } from "../../api/recording";

import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import ActionCard from "../../components/feature/analysis/ActionCard";
import microphoneSpeakingIcon from "../../assets/icons/microphone-speaking.svg";
import attachmentIcon from "../../assets/icons/attachment.svg";
import uploadFileIcon from "../../assets/icons/upload-file.svg";

const NOTICES = [
  "친구와의 일상대화, 연인과의 일상/갈등 대화, 자녀와의 갈등대화를 분석할 수 있어요.",
  "녹음된 음성은 대화 분석에 사용돼요.",
  "주변 소음이나 녹음 상태에 따라 분석 결과가 정확하지 않을 수 있어요.",
  "함께 대화하는 사람이 있다면 녹음 사실을 먼저 알려주세요.",
];

const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};

const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

// 파일 길이(초). 브라우저가 읽지 못하면 null
const readDuration = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const done = (value) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    audio.preload = "metadata";
    audio.onloadedmetadata = () => done(Number.isFinite(audio.duration) ? audio.duration : null);
    audio.onerror = () => done(null);
    audio.src = url;
  });

const UploadCard = ({ name, meta, progress }) => {
  const isDone = progress >= 100;

  return (
    <div className="relative h-[190px] w-[342px] shrink-0 overflow-clip rounded-[18px] border border-[#eee] bg-white shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_49.1px_0px_rgba(0,0,0,0.1)]">
      <img src={uploadFileIcon} alt="" className="absolute top-[19px] left-[18px] block h-[40.611px] w-[39.438px] max-w-none" />
      <p className="text-label absolute top-[18px] left-[72px] w-[240px] truncate text-[#262626]">{name}</p>
      {meta && <p className="text-label-small absolute top-[45px] left-[72px] w-[240px] text-[#595959]">{meta}</p>}
      <div className="absolute top-[102px] left-[18px] h-[8px] w-[306px] overflow-hidden rounded-[4px] bg-[#eee]">
        <div
          className="h-full rounded-[4px] bg-[#ff765b] transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-label absolute top-[124px] right-[18px] text-right text-[#ff765b]">
        {isDone ? "완료" : `${progress}%`}
      </p>
      <p className="text-caption absolute top-[154px] left-[18px] w-[306px] text-[#595959]">
        업로드 중에는 화면을 닫지 말아주세요.
      </p>
    </div>
  );
};

const AnalysisStart = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const abortRef = useRef(null);
  // { name, meta, progress, recordingId }
  const [upload, setUpload] = useState(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setUpload({ name: file.name, meta: formatSize(file.size), progress: 0, recordingId: null });

    readDuration(file).then((seconds) => {
      if (seconds == null) return;
      setUpload((prev) => prev && { ...prev, meta: `${formatDuration(seconds)} · ${formatSize(file.size)}` });
    });

    try {
      const result = await uploadRecording(file, {
        signal: controller.signal,
        onProgress: (progress) => setUpload((prev) => prev && { ...prev, progress: Math.min(progress, 99) }),
      });
      setUpload((prev) => prev && { ...prev, progress: 100, recordingId: result.recordingId });
    } catch (error) {
      if (controller.signal.aborted) return;
      alert(error.message);
      setUpload(null);
    }
  };

  const cancelUpload = () => {
    abortRef.current?.abort();
    setUpload(null);
  };

  if (upload) {
    return (
      <main className="mx-auto flex h-[844px] w-[390px] flex-col justify-between bg-white">
        <div className="flex w-full flex-col items-center gap-[84px]">
          <div className="w-full px-[24px] py-[16px]">
            <AppHeader title="대화 분석" onBack={cancelUpload} onLogoClick={() => navigate("/home")} />
          </div>
          <UploadCard {...upload} />
        </div>

        <div className="w-full px-[24px] pb-[30px]">
          <Button
            text="다음"
            disabled={!upload.recordingId}
            onClick={() => navigate("/analysis/type", { state: { recordingId: upload.recordingId } })}
            className="flex w-full items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white disabled:bg-[#d9d9d9]"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <AppHeader title="대화 분석" onBack={() => navigate(-1)} onLogoClick={() => navigate("/home")} />

      <div className="flex w-full flex-col gap-[60px]">
        <div className="flex w-full flex-col items-end gap-[8px]">
          <ul className="text-label w-full list-disc space-y-[19px] rounded-[16px] border border-[#eee] bg-white py-[24px] pr-[24px] pl-[48px] text-black drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
            {NOTICES.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
          <button type="button" className="text-label-small border-b border-[#f5f5f5] text-[#d9d9d9]">
            개인정보 처리방침 · 녹음 데이터 처리 안내
          </button>
        </div>

        <div className="flex w-full flex-col gap-[24px]">
          <ActionCard
            icon={<img src={microphoneSpeakingIcon} alt="" className="size-[24px] shrink-0" />}
            label="새로 녹음 시작하기"
            onClick={() => navigate("/analysis/record")}
          />
          <ActionCard
            icon={<img src={attachmentIcon} alt="" className="size-[24px] shrink-0" />}
            label="대화 녹음 가져오기"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".m4a,.mp3,audio/mp4,audio/mpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </main>
  );
};

export default AnalysisStart;
