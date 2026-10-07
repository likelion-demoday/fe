import api from "./axios";

export const uploadRecording = async (file) => {
  const formData = new FormData();
  formData.append("audioFile", file);

  return api.post("/api/v1/recordings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const mapSpeakers = async (
  recordingId,
  { selfSpeakerLabel, partnerNickname, selfRole },
) => {
  return api.post(`/api/v1/recordings/${recordingId}/speaker-mapping`, {
    selfSpeakerLabel,
    partnerNickname,
    selfRole,
  });
};

export const selectRecordingType = async (recordingId, type) => {
  return api.patch(`/api/v1/recordings/${recordingId}/type`, {
    relationshipType: type,
  });
};

export const getSpeakerSamples = async (recordingId) => {
  return api.get(`/api/v1/recordings/${recordingId}/speaker-samples`);
};

export const getRecordingStatus = async (recordingId) => {
  return api.get(`/api/v1/recordings/${recordingId}/status`);
};

export const deleteRecording = async (recordingId) => {
  return api.delete(`/api/v1/recordings/${recordingId}`);
};
