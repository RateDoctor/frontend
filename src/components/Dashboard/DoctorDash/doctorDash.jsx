import React, { useState, useEffect } from "react";
import { Pagination, Modal, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../../layouts/load/load.jsx";
import Backgrounds from "../../addDoctor/Backgrounds.jsx"; 
import Teaching from "../../addDoctor/Teaching.jsx";       
import "./doctorDash.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function DoctorTable() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());
  const [previewImage, setPreviewImage] = useState("");
  const [universities, setUniversities] = useState([]);
  const [fields, setFields] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  function getEmptyForm() {
    return {
      doctorName: "",
      affiliations: [{ name: "", joined: "" }],
      backgrounds: [""],
      teaching: [""],
      supervision: [""],
      experience: [""],
      fieldOfStudyId: "",
      universityId: "",
      topicIds: [],
      profileFile: null,
    };
  }

  const safeArray = (value) => Array.isArray(value) ? value : value ? [value] : [];

  useEffect(() => {
    fetchDoctors();
    fetchLists();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/doctors`);
      setDoctors(Array.isArray(data) ? data : data.doctors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
      const [uniRes, fieldRes, topicRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/universities`, { headers }),
        axios.get(`${BASE_URL}/api/fields`, { headers }),
        axios.get(`${BASE_URL}/api/topics`, { headers }),
      ]);
      setUniversities(uniRes.data || []);
      setFields(fieldRes.data || []);
      setTopics(topicRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, profileFile: e.target.files[0] }));
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };


  const handleDelete = async (doctorId) => {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: "This action cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
  });

  if (confirm.isConfirmed) {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${BASE_URL}/api/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted!", "Doctor has been deleted.", "success");
      fetchDoctors(); // refresh the list
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Failed to delete doctor", "error");
    }
  }
};


  const handleEditClick = (doctor) => {
    if (!doctor) return;
    setEditDoctorId(doctor._id);
    setIsEditing(true);
    setFormData({
      doctorName: doctor.name || "",
      affiliations: safeArray(doctor.affiliations).map(a => ({ name: a.name || "", joined: a.joined || "" })),
      backgrounds: safeArray(doctor.background),
      teaching: safeArray(doctor.teaching),
      supervision: safeArray(doctor.supervision),
      experience: safeArray(doctor.experience),
      fieldOfStudyId: doctor.fieldOfStudy?._id || "",
      universityId: doctor.university?._id || "",
      topicIds: safeArray(doctor.topic)
        .map(t => (t && t._id ? t._id : t))
        .filter(Boolean),
      profileFile: null,
    });
    setPreviewImage(doctor.profileImage || "");
    setOpen(true);
  };

  const handleAddClick = () => {
    setEditDoctorId(null);
    setIsEditing(false);
    setFormData(getEmptyForm());
    setPreviewImage("");
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setIsEditing(false);
    setEditDoctorId(null);
    setFormData(getEmptyForm());
    setPreviewImage("");
  };

  const updateArrayField = (field, idx, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: safeArray(prev[field]).map((item, i) => i === idx ? value : item)
    }));
  };

  const removeArrayItem = (field, idx) => {
    setFormData(prev => ({
      ...prev,
      [field]: safeArray(prev[field]).filter((_, i) => i !== idx)
    }));
  };

  const addArrayItem = (field, newItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: safeArray(prev[field]).concat(newItem)
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!formData.doctorName?.trim()) {
        Swal.fire("Error", "Doctor name is required", "error");
        return;
      }

      let payload;
      let config = { headers: { Authorization: `Bearer ${token}` } };

      const topicIds = safeArray(formData.topicIds)
      .filter(t => t != null && t !== "")  
      .map(t => t.toString());


      if (formData.profileFile) {
        payload = new FormData();
        payload.append("name", formData.doctorName.trim());
        payload.append("fieldOfStudyId", formData.fieldOfStudyId || "");
        payload.append("universityId", formData.universityId || "");
        payload.append("profileFile", formData.profileFile);
        payload.append("topic", JSON.stringify(topicIds));
        payload.append("affiliations", JSON.stringify(safeArray(formData.affiliations)));
        payload.append("background", JSON.stringify(safeArray(formData.backgrounds)));
        payload.append("teaching", JSON.stringify(safeArray(formData.teaching)));
        payload.append("supervision", JSON.stringify(safeArray(formData.supervision)));
        payload.append("experience", JSON.stringify(safeArray(formData.experience)));
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = {
          name: formData.doctorName.trim(),
          fieldOfStudyId: formData.fieldOfStudyId || "",
          universityId: formData.universityId || null,
          topic: topicIds,
          affiliations: safeArray(formData.affiliations),
          background: safeArray(formData.backgrounds),
          teaching: safeArray(formData.teaching),
          supervision: safeArray(formData.supervision),
          experience: safeArray(formData.experience),
        };
        config.headers["Content-Type"] = "application/json";
      }

      if (isEditing && editDoctorId) {
        const res = await axios.put(`${BASE_URL}/api/doctors/${editDoctorId}`, payload, config);
        console.log("Update response:", res.data);
        Swal.fire("Success", "Doctor updated successfully!", "success");
      } else {
        const res = await axios.post(`${BASE_URL}/api/doctors`, payload, config);
        console.log("Add response:", res.data);
        Swal.fire("Success", "Doctor added successfully!", "success");
      }

      fetchDoctors();
      handleCancel();

    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      Swal.fire("Error", err.response?.data?.message || "Failed to submit doctor", "error");
    }
  };

  const filteredDoctors = doctors.filter(d => d.name?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      {loading ? <Loader /> : (
        <div className="dash-main">
          <h2>Doctors List</h2>

          <div className="add-button">
            <Button type="primary" onClick={handleAddClick}>Add Doctor</Button>
            <input
              type="text"
              placeholder="Search by doctor name"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </div>

          <div className="table-fixing">
            {filteredDoctors.length === 0 ? <p>No doctors found.</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>University</th>
                    <th>Backgrounds</th>
                    <th>Teaching</th>
                    <th>Profile</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map(doctor => (
                    <tr key={doctor._id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.university?.name || "-"}</td>
                      <td>{safeArray(doctor.background).join(", ") || "-"}</td>
                      <td>{safeArray(doctor.teaching).join(", ") || "-"}</td>
                      <td>
                        {doctor.profileImage && 
                          <img src={`${BASE_URL}/${doctor.profileImage}`} alt="doctor" style={{ width: "100px", height: "100px" }} />}
                      </td>
                      <td>
                        <Button onClick={() => handleEditClick(doctor)}>Edit</Button>
                        <Button danger onClick={() => handleDelete(doctor._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <Pagination onChange={setCurrentPage} current={currentPage} total={filteredDoctors.length} />

          <Modal
            title={isEditing ? "Edit Doctor" : "Add Doctor"}
            open={open}
            onCancel={handleCancel}
            width={800}
            footer={[
              <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
              <Button key="save" type="primary" onClick={handleSubmit}>{isEditing ? "Update" : "Save"}</Button>,
            ]}
          >
            <div className="form-left">
              <label>Doctor Name *</label>
              <input value={formData.doctorName || ""} onChange={e => setFormData(prev => ({ ...prev, doctorName: e.target.value }))} />

              <label>University</label>
              <select value={formData.universityId || ""} onChange={e => setFormData(prev => ({ ...prev, universityId: e.target.value }))}>
                <option value="">Select University</option>
                {universities.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>

              <label>Profile Image</label>
              <input type="file" onChange={handleFileChange} />
              {previewImage && <img src={previewImage} width="100px" alt="preview" />}

              <label>Affiliations</label>
              {safeArray(formData.affiliations).map((aff, idx) => (
                <div key={idx} className="affiliation-item">
                  <input
                    placeholder="Affiliation name"
                    value={aff.name || ""}
                    onChange={e => updateArrayField("affiliations", idx, { ...aff, name: e.target.value })}
                  />
                  <input
                    type="date"
                    value={aff.joined || ""}
                    onChange={e => updateArrayField("affiliations", idx, { ...aff, joined: e.target.value })}
                  />
                  <button type="button" onClick={() => removeArrayItem("affiliations", idx)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("affiliations", { name: "", joined: "" })}>Add Affiliation</button>

              <Backgrounds formData={formData} setFormData={setFormData} fields={fields} setFields={setFields} />
              <Teaching formData={formData} setFormData={setFormData} topics={topics} setTopics={setTopics} fieldOfStudyId={formData.fieldOfStudyId} />

              {["supervision", "experience"].map(field => (
                <div key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {safeArray(formData[field]).map((item, idx) => (
                    <div key={idx} className="array-item">
                      <input value={item || ""} onChange={e => updateArrayField(field, idx, e.target.value)} />
                      <button type="button" onClick={() => removeArrayItem(field, idx)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem(field, "")}>Add {field.slice(0, -1)}</button>
                </div>
              ))}
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}

export default DoctorTable;
