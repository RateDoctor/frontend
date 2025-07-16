import { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;


const useDoctorData = (doctorId) => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${BASE_URL}/api/doctors/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctorData(response.data.doctor);
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        if (err.response) {
          if (err.response.status === 404) {
            setError("Doctor not found.");
          } else {
            setError(`Error: ${err.response.status} ${err.response.statusText}`);
          }
        } else {
          setError("Failed to fetch doctor data. Please check your network.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorData();
    }
  }, [doctorId]);

  return { doctorData, loading, error };
};

export default useDoctorData;
