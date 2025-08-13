import React, { useState, useEffect } from "react";
import { Pagination, Modal, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../load/load.jsx";
import "./universityDash.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function UniversityDashboard() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUni, setEditingUni] = useState(null); // track edit

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    logo: null,
    phdDoctors: [],
    affiliations: [{ name: "", joined: "" }],
  });
  const [previewLogo, setPreviewLogo] = useState("");

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/universities`);
      setUniversities(res.data.universities || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, logo: e.target.files[0] });
      setPreviewLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      phone: "",
      logo: null,
      phdDoctors: [],
      affiliations: [{ name: "", joined: "" }],
    });
    setPreviewLogo("");
    setEditingUni(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("location", formData.location);
      payload.append("phone", formData.phone);
      if (formData.logo) payload.append("logo", formData.logo);
      payload.append("phdDoctors", JSON.stringify(formData.phdDoctors));
      payload.append("affiliations", JSON.stringify(formData.affiliations));

      if (editingUni) {
        // EDIT
        await axios.put(`${BASE_URL}/api/universities/${editingUni._id}`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "University updated successfully!", "success");
      } else {
        // ADD
        await axios.post(`${BASE_URL}/api/universities`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "University added successfully!", "success");
      }

      fetchUniversities();
      setOpenModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", editingUni ? "Failed to update university" : "Failed to add university", "error");
    }
  };

  const handleEditClick = (uni) => {
    setEditingUni(uni);
    setFormData({
      name: uni.name || "",
      location: uni.location || "",
      phone: uni.phone || "",
      logo: null,
      phdDoctors: uni.phdDoctors || [],
      affiliations: uni.affiliations || [{ name: "", joined: "" }],
    });
    setPreviewLogo(uni.logo ? `${BASE_URL}/${uni.logo}` : "");
    setOpenModal(true);
  };

  const filteredUniversities = universities.filter((uni) =>
    uni.name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="dash-main">
          <h2>Universities List</h2>

          <div className="add-button">
            <Button type="primary" onClick={() => setOpenModal(true)}>
              Add University
            </Button>
            <input
              type="text"
              placeholder="Search by university name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </div>

          <div className="table-fixing">
            {filteredUniversities.length === 0 ? (
              <p>No universities found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Phone</th>
                    <th>Logo</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUniversities.map((uni) => (
                    <tr key={uni._id}>
                      <td>{uni.name}</td>
                      <td>{uni.location || "-"}</td>
                      <td>{uni.phone || "-"}</td>
                      <td>
                        {uni.logo && (
                          <img
                            src={`${BASE_URL}/${uni.logo}`}
                            alt="logo"
                            style={{ width: "100px", height: "100px" }}
                          />
                        )}
                      </td>
                      <td>
                        <Button onClick={() => handleEditClick(uni)}>Edit</Button>
                        <Button
                          danger
                          onClick={() => Swal.fire("TODO", "Delete action", "info")}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Pagination
              onChange={setCurrentPage}
              current={currentPage}
              total={filteredUniversities.length}
            />
          </div>

          {/* Modal */}
          <Modal
            title={editingUni ? "Edit University" : "Add University"}
            open={openModal}
            onCancel={() => {
              setOpenModal(false);
              resetForm();
            }}
            width={800}
            footer={[
              <Button key="cancel" onClick={() => { setOpenModal(false); resetForm(); }}>Cancel</Button>,
              <Button key="save" type="primary" onClick={handleSubmit}>
                {editingUni ? "Update" : "Save"}
              </Button>,
            ]}
          >
            <div className="form-left">
              <label>Name *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <label>Location *</label>
              <input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <label>Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <label>Logo</label>
              <input type="file" onChange={handleFileChange} />
              {previewLogo && <img src={previewLogo} width="100px" alt="preview logo" />}

              <label>Affiliations</label>
              {formData.affiliations.map((aff, idx) => (
                <div key={idx} className="affiliation-item">
                  <input
                    placeholder="Affiliation name"
                    value={aff.name}
                    onChange={(e) => {
                      const updated = [...formData.affiliations];
                      updated[idx].name = e.target.value;
                      setFormData({ ...formData, affiliations: updated });
                    }}
                  />
                  <input
                    type="date"
                    value={aff.joined}
                    onChange={(e) => {
                      const updated = [...formData.affiliations];
                      updated[idx].joined = e.target.value;
                      setFormData({ ...formData, affiliations: updated });
                    }}
                  />
                  <button
                    onClick={() => {
                      const updated = formData.affiliations.filter((_, i) => i !== idx);
                      setFormData({ ...formData, affiliations: updated });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    affiliations: [...formData.affiliations, { name: "", joined: "" }],
                  })
                }
              >
                Add Affiliation
              </button>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}

export default UniversityDashboard;
