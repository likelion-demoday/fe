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

// 생성 완료된 캐릭터 이미지를 { [speakerRole]: objectURL } 형태로 반환
export const getCharacterImageUrls = async (recordingId) => {
  const { images = [] } = await getCharacterImageStatus(recordingId);
  const entries = await Promise.all(
    images
      .filter((image) => image.status === "COMPLETED" && image.contentUrl)
      .map(async ({ speakerRole, contentUrl }) => {
        const blob = await getCharacterImageBlob(contentUrl);
        return [speakerRole, URL.createObjectURL(blob)];
      }),
  );
  return Object.fromEntries(entries);
};



