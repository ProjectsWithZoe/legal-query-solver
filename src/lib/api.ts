import axios from "axios";

const API_URL = "https://contracts-project.onrender.com";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const analyzeDocument = async (query: string, fileId: string) => {
  const response = await axios.post(`${API_URL}/analyze`, {
    query,
    file_id: fileId,
  });

  return response.data;
};
