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
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}/api/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctorData(response.data);
      } catch (err) {
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
