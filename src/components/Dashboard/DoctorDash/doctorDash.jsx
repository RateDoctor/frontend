import React, { useState, useEffect } from "react";
import { Pagination, Modal, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../load/load.jsx";
import Backgrounds from "../../addDoctor/Backgrounds.jsx"; // Component for fieldOfStudy
import Teaching from "../../addDoctor/Teaching.jsx";       // Component for topics
import "./doctorDash.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function DoctorTable() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState(null);

  const [formData, setFormData] = useState({
    doctorName: "",
    affiliations: [{ name: "", joined: "" }],
    backgrounds: [""],  // maps to Field of Study
    teaching: [""],     // maps to Topics
    supervision: [""],
    experience: [""],
    fieldOfStudyId: "",
    topicIds: [],
    profileFile: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [universities, setUniversities] = useState([]);
  const [fields, setFields] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
      setUniversities(uniRes.data);
      setFields(fieldRes.data);
      setTopics(topicRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, profileFile: e.target.files[0] });
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEditClick = (doctor) => {
    setIsEditing(true);
    setEditDoctorId(doctor._id);
    setFormData({
      doctorName: doctor.name || "",
      affiliations: doctor.affiliations || [{ name: "", joined: "" }],
      backgrounds: doctor.background || [""],
      teaching: doctor.teaching || [""],
      supervision: doctor.supervision || [""],
      experience: doctor.experience || [""],
      fieldOfStudyId: doctor.fieldOfStudy?._id || "",
      topicIds: doctor.topic?.map(t => t._id) || [],
      profileFile: null,
    });
    setPreviewImage(doctor.profileImage || "");
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        name: formData.doctorName,
        affiliations: formData.affiliations,
        background: formData.backgrounds,
        teaching: formData.teaching,
        supervision: formData.supervision,
        experience: formData.experience,
        fieldOfStudy: formData.fieldOfStudyId,
        topicIds: formData.topicIds,
      };

      let res;
      if (isEditing && editDoctorId) {
        res = await axios.put(`${BASE_URL}/api/doctors/${editDoctorId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire("Success", "Doctor updated successfully!", "success");
      } else {
        res = await axios.post(`${BASE_URL}/api/doctors`, payload, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire("Success", "Doctor added successfully!", "success");
      }

      fetchDoctors();
      resetForm();
      setOpen(false);
      setIsEditing(false);
      setEditDoctorId(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit doctor", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      doctorName: "",
      affiliations: [{ name: "", joined: "" }],
      backgrounds: [""],
      teaching: [""],
      supervision: [""],
      experience: [""],
      fieldOfStudyId: "",
      topicIds: [],
      profileFile: null,
    });
    setPreviewImage("");
  };

  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      {loading ? <Loader /> : (
        <div className="dash-main">
          <h2>Doctors List</h2>
          <div className="add-button">
            <Button type="primary" onClick={() => { setOpen(true); setIsEditing(false); }}>Add Doctor</Button>
            <input type="text" placeholder="Search by doctor name" value={filter} onChange={e => setFilter(e.target.value)} style={{ marginLeft: 10 }} />
          </div>

          <div className="table-fixing">
            {filteredDoctors.length === 0 ? <p>No doctors found.</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>University</th>
                    {/* <th>Field</th> */}
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
                      {/* <td>{doctor.fieldOfStudy?.name || "-"}</td> */}
                      <td>{doctor.background?.join(", ") || "-"}</td>
                      <td>{doctor.teaching?.join(", ") || "-"}</td> 
                      <td>{doctor.profileImage && <img src={`${BASE_URL}/${doctor.profileImage}`} alt="doctor" style={{ width: "100px", height: "100px" }} />}</td>
                      <td>
                        <Button onClick={() => handleEditClick(doctor)}>Edit</Button>
                        <Button danger onClick={() => Swal.fire("TODO", "Delete action", "info")}>Delete</Button>
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
            onCancel={() => { setOpen(false); resetForm(); setIsEditing(false); setEditDoctorId(null); }}
            width={800}
            footer={[
              <Button key="cancel" onClick={() => { setOpen(false); resetForm(); setIsEditing(false); setEditDoctorId(null); }}>Cancel</Button>,
              <Button key="save" type="primary" onClick={handleSubmit}>{isEditing ? "Update" : "Save"}</Button>,
            ]}
          >
            <div className="form-left">
              <label>Doctor Name *</label>
              <input value={formData.doctorName} onChange={e => setFormData(prev => ({ ...prev, doctorName: e.target.value }))} />

              <label>Profile Image</label>
              <input type="file" onChange={handleFileChange} />
              {previewImage && <img src={previewImage} width="100px" alt="preview" />}

              {/* Affiliations */}
              <label>Affiliations</label>
              {formData.affiliations.map((aff, idx) => (
                <div key={idx} className="affiliation-item">
                  <input placeholder="Affiliation name" value={aff.name} onChange={e => {
                    const updated = [...formData.affiliations];
                    updated[idx].name = e.target.value;
                    setFormData(prev => ({ ...prev, affiliations: updated }));
                  }} />
                  <input type="date" value={aff.joined} onChange={e => {
                    const updated = [...formData.affiliations];
                    updated[idx].joined = e.target.value;
                    setFormData(prev => ({ ...prev, affiliations: updated }));
                  }} />
                  <button onClick={() => setFormData(prev => ({ ...prev, affiliations: prev.affiliations.filter((_, i) => i !== idx) }))}>Remove</button>
                </div>
              ))}
              <button onClick={() => setFormData(prev => ({ ...prev, affiliations: [...prev.affiliations, { name: "", joined: "" }] }))}>Add Affiliation</button>

              {/* Backgrounds (Field of Study) */}
              <Backgrounds formData={formData} setFormData={setFormData} fields={fields} setFields={setFields} />

              {/* Teaching (Topics) */}
              <Teaching formData={formData} setFormData={setFormData} topics={topics} setTopics={setTopics} />

              {/* Supervision & Experience */}
              {["supervision", "experience"].map(field => (
                <div key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {formData[field].map((item, idx) => (
                    <div key={idx} className="array-item">
                      <input value={item} onChange={e => {
                        const updated = [...formData[field]];
                        updated[idx] = e.target.value;
                        setFormData(prev => ({ ...prev, [field]: updated }));
                      }} />
                      <button onClick={() => setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }))}>Remove</button>
                    </div>
                  ))}
                  <button onClick={() => setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }))}>Add {field.slice(0, -1)}</button>
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
