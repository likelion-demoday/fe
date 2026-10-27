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



