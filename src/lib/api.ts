import axios from "axios";

const API_URL = "https://contracts-project.onrender.com";

//function called when file is uploaded
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//function called when query is entered
export const analyzeDocument = async (query: string, fileId: string) => {
  const response = await axios.post(`${API_URL}/analyze`, {
    query,
    file_id: fileId,
  });

  return response.data;
};
