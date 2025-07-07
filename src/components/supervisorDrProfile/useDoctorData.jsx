import { useState, useEffect } from "react";
import axios from "axios";

const useDoctorData = (doctorId) => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:5000/api/doctors/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctorData(response.data.doctor);  // Assuming the response contains `doctor` in the data
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setError("Failed to fetch doctor data. Please try again later.");
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
