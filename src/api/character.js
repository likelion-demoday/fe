import api from "./axios";

export const requestCharacterImage = async (recordingId) => {
    return api.post(`/api/v1/analyses/${recordingId}/character-images`);
};

export const getCharacterImageStatus = async (recordingId) => {
    return api.get(`/api/v1/analyses/${recordingId}/character-images`);
}

export const getCharacterImageBlob = async (contentUrl) => {
  return api.get(contentUrl, { responseType: "blob" });
};

// 서버가 준 카드 색상. 값이 없으면 키를 빼서 CHARACTER_STYLES 기본값을 유지
const toCardStyle = ({ characterNameTextColor, cardBackgroundGradientColors: colors }) => ({
  ...(characterNameTextColor && { titleColor: characterNameTextColor }),
  ...(colors?.length >= 2 && {
    background: `linear-gradient(146.42deg, ${colors[0]} 40.138%, ${colors[1]} 89.392%)`,
  }),
});

// 생성 완료된 캐릭터를 { [speakerRole]: { imageUrl, titleColor, background } } 형태로 반환
export const getCharacterImages = async (recordingId) => {
  const { images = [] } = await getCharacterImageStatus(recordingId);
  const entries = await Promise.all(
    images
      .filter((image) => image.status === "COMPLETED" && image.contentUrl)
      .map(async (image) => {
        const blob = await getCharacterImageBlob(image.contentUrl);
        return [image.speakerRole, { imageUrl: URL.createObjectURL(blob), ...toCardStyle(image) }];
      }),
  );
  return Object.fromEntries(entries);
};



