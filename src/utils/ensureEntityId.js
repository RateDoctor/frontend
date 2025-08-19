// utils/ensureEntityId.js
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

// 🔹 Capitalize helper
const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


export const ensureEntityId = async (list, setList, endpoint, name, payload = {}) => {
  const match = list.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (match) return match._id;

  const role = localStorage.getItem("userRole");
  if (role !== "admin") {
    throw new Error("Only admin can create new universities.");
  }

  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.post(
      `${BASE_URL}/api/${endpoint}`,
      { name: capitalizeFirstLetter(name), ...payload },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setList(prev => [...prev, res.data]);
    return res.data._id;
  } catch (err) {
    console.error(`Error creating ${endpoint}:`, err.response?.data || err.message);
    throw new Error(`Failed to create ${endpoint}`);
  }
};
