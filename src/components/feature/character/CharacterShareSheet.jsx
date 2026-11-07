import { useEffect, useState } from "react";

import BottomSheet, { SheetButton } from "../../common/BottomSheet";
import { createCharacterStoryImage } from "../../../utils/characterShareImage";

const downloadFile = (file) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// 캐릭터 카드 공유 시트: 시트가 열릴 때 스토리 이미지를 미리 만들어 둠
// (사파리는 버튼을 누른 직후에만 공유 창을 열 수 있어서, 누른 뒤에 이미지를 만들면 공유가 막힘)
const CharacterShareSheet = ({ character, onClose }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let previewUrl = null;
    Promise.all([createCharacterStoryImage(character, "download"), createCharacterStoryImage(character, "story")])
      .then(([download, story]) => {
        if (!active) return;
        previewUrl = URL.createObjectURL(download);
        setImage({ download, story, previewUrl });
      })
      .catch(() => active && setError("공유 이미지를 만들지 못했어요."));
    return () => {
      active = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [character]);

  // 인스타 스토리: 휴대폰 공유 창에 이미지를 넘김
  const shareToStory = async () => {
    if (!image) return;
    if (!navigator.canShare?.({ files: [image.story] })) {
      downloadFile(image.download);
      alert("이 기기에서는 바로 공유할 수 없어서 이미지를 저장했어요.");
      return;
    }
    try {
      await navigator.share({ files: [image.story] });
    } catch {
      // 사용자가 공유를 취소한 경우
    }
  };

  return (
    <BottomSheet
      title="캐릭터 공유하기"
      onClose={onClose}
      showCharacter={false}
      contentGap="gap-[20px]"
      footer={
        <>
          <SheetButton text="이미지 저장" onClick={() => image && downloadFile(image.download)} disabled={!image} />
          <SheetButton text="인스타 스토리" onClick={shareToStory} disabled={!image} />
        </>
      }
    >
      <div className="flex h-[260px] w-[146px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#eee]">
        {image ? (
          <img src={image.previewUrl} alt={`${character.name} 공유 이미지`} className="block size-full" />
        ) : (
          <p className="text-caption text-[#787878]" role={error ? "alert" : "status"}>
            {error || "이미지 만드는 중..."}
          </p>
        )}
      </div>
      <p className="text-caption text-center break-keep text-[#787878]">
        공유창에서 Instagram을 고르면 바로 스토리에 공유할 수 있어요
      </p>
    </BottomSheet>
  );
};

export default CharacterShareSheet;
