import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

// Capitalize helper
const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Ensures an entity exists and returns its ID
 */
export const ensureEntityId = async (list, setList, endpoint, name, payload = {}) => {
  if (!name || !name.trim()) throw new Error("Name is required");

  const match = list.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (match) return match._id;

  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Session expired. Please log in again.");
  }

  try {
    const res = await axios.post(
      `${BASE_URL}/api/${endpoint}`,
      { name: capitalizeFirstLetter(name), ...payload },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Ensure the backend returned a valid _id
    const entity = res.data?.[endpoint.slice(0, -1)] || res.data; // fallback if API returns {field: {...}}
    if (!entity?._id) throw new Error(`Invalid response from ${endpoint}`);

    // Update local state immediately
    setList(prev => [...prev, entity]);

    return entity._id;
  } catch (err) {
    console.error(`Error creating ${endpoint}:`, err.response?.data || err.message);
    if (err.response?.status === 401) {
      throw new Error("Token is invalid or expired. Please log in again.");
    }
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
