import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const useDoctorData = (doctorId) => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!doctorId) return;

  const fetchDoctor = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      console.log("Fetching doctor with ID:", doctorId);
      console.log("Using BASE_URL:", BASE_URL);
      console.log("Auth token:", token);

      const response = await axios.get(`${BASE_URL}/api/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Doctor fetch response:", response.data);
      setDoctorData(response.data);
    } catch (err) {
      console.error("Error fetching doctor data:", err);
      setError("Failed to fetch doctor data");
    } finally {
      setLoading(false);
    }
  };

  fetchDoctor();
}, [doctorId]);


  return { doctorData, loading, error };
};

export default useDoctorData;
