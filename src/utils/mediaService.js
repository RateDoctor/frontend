import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const uploadDoctorImage = async (file, doctorId, token) => {
  if (!file) return null;

  const mediaForm = new FormData();
  mediaForm.append("file", file);
  mediaForm.append("doctorId", doctorId);

  try {
    const res = await axios.post(`${BASE_URL}/api/media/upload`, mediaForm, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (err) {
    console.error("Upload image error:", err.response?.data || err.message);
    throw err;
  }
};
