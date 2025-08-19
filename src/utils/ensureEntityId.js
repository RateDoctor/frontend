// utils/ensureEntityId.js
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

// 🔹 Capitalize helper
const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const ensureEntityId = async (list, setList, endpoint, name, payload = {}) => {
  const match = list.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (match) return match._id;

  const role = localStorage.getItem("userRole"); // "admin" or "user"
  const token = localStorage.getItem("authToken");

  try {
    const res = await axios.post(
      `${BASE_URL}/api/${endpoint}`,
      { name: capitalizeFirstLetter(name), ...payload },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update local state so new entity shows up immediately
    setList(prev => [...prev, res.data]);
    return res.data._id;
  } catch (err) {
    console.error(`Error creating ${endpoint}:`, err.response?.data || err.message);
    throw new Error(`Failed to create ${endpoint}`);
  }
};



// import axios from "axios";
// const BASE_URL = process.env.REACT_APP_API_URL;

// export const ensureEntityId = async (
//   list,
//   endpoint,
//   name,
//   payload = {},
//   { responseKey, allowCreate = true, normalizeName = true } = {}
// ) => {
//   const formattedName = normalizeName
//     ? name.charAt(0).toUpperCase() + name.slice(1).trim()
//     : name.trim();

//   const match = list.find(item => item.name.toLowerCase() === formattedName.toLowerCase());
//   if (match) return match._id;

//   if (!allowCreate) throw new Error(`Not allowed to create ${endpoint}`);

//   try {
//     const token = localStorage.getItem("authToken");
//     const res = await axios.post(
//       `${BASE_URL}/api/${endpoint}`,
//       { name: formattedName, ...payload },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const entity = responseKey ? res.data?.[responseKey] : res.data;
//     if (!entity?._id) {
//       throw new Error(`Invalid response for ${endpoint}: ${JSON.stringify(res.data)}`);
//     }

//     return entity;
//   } catch (err) {
//     console.error(`Error creating ${endpoint}:`, err.response?.data || err.message);
//     throw new Error(`Failed to create ${endpoint}`);
//   }
// };
