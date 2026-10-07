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