import React, { useState, useEffect, useMemo } from "react";
import { Pagination, Modal, Button, Input, Spin } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import "./universityDash.css";

const BASE_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 10;

// إنشاء Axios instance مع الـ token
const api = axios.create();
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function UniversityDashboard() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingUni, setEditingUni] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [formData, setFormData] = useState({ name: "", location: "", phone: "" });
  const userRole = localStorage.getItem("userRole");

  // Capitalize for display
  const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1) || "";

  // Fetch universities
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${BASE_URL}/api/universities`);
      setUniversities(Array.isArray(res.data) ? res.data : res.data.universities || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch universities", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUniversities(); }, []);

  const resetForm = () => {
    setFormData({ name: "", location: "", phone: "" });
    setEditingUni(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return Swal.fire("Validation", "Name is required!", "warning");
    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        location: formData.location?.trim() || "",
        phone: formData.phone?.trim() || "",
      };
      const response = editingUni
        ? await api.put(`${BASE_URL}/api/universities/${editingUni._id}`, payload)
        : await api.post(`${BASE_URL}/api/universities`, payload);

      setUniversities((prev) =>
        editingUni ? prev.map((u) => (u._id === editingUni._id ? response.data : u)) : [response.data, ...prev]
      );
      Swal.fire("Success", editingUni ? "University updated!" : "University added!", "success");
      setOpenModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.error || "Something went wrong", "error");
    } finally { setLoading(false); }
  };

const handleDelete = async (uniId) => {
  if (!uniId) {
    return Swal.fire("Error", "Invalid university ID", "error");
  }

  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the university!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return Swal.fire("Error", "Not authorized", "error");
    }

    const response = await axios.delete(`${BASE_URL}/api/universities/${uniId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // إزالة الجامعة من الواجهة مباشرة
    setUniversities((prev) => prev.filter((u) => u._id !== uniId));

    Swal.fire("Deleted!", "University has been deleted.", "success");
  } catch (err) {
    console.error("Delete error:", err.response?.data || err);
    const msg = err.response?.data?.error || err.response?.data?.message || "Failed to delete university";
    Swal.fire("Error", msg, "error");
  }
};


  const handleEditClick = (uni) => {
    setEditingUni(uni);
    setFormData({ name: uni.name || "", location: uni.location || "", phone: uni.phone || "" });
    setOpenModal(true);
  };

  const filteredUniversities = useMemo(
    () => universities.filter((u) => u.name?.toLowerCase().includes(filter.toLowerCase())),
    [universities, filter]
  );

  const paginatedUniversities = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUniversities.slice(start, start + PAGE_SIZE);
  }, [filteredUniversities, currentPage]);

  return (
    <div className="dash-main">
      <h2>Universities List</h2>

      <div className="add-button">
        <Button
          type="primary"
          onClick={() => {
            if (userRole !== "admin") return Swal.fire("Error", "Only admin can add universities", "error");
            setOpenModal(true);
          }}
        >
          Add University
        </Button>
        <Input
          placeholder="Search by university name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: 10, width: 250 }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUniversities.map((uni) => (
                  <tr key={uni._id}>
                    <td>{capitalize(uni.name)}</td>
                    <td>{uni.location || "-"}</td>
                    <td>{uni.phone || "-"}</td>
                    <td>
                      <Button onClick={() => handleEditClick(uni)}>Edit</Button>
                      <Button danger style={{ marginLeft: 5 }} onClick={() => handleDelete(uni._id)}>Delete</Button>
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
            pageSize={PAGE_SIZE}
            style={{ marginTop: 20, textAlign: "right" }}
          />
        </div>
      )}

      <Modal
        title={editingUni ? "Edit University" : "Add University"}
        open={openModal}
        onCancel={() => { setOpenModal(false); resetForm(); }}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => { setOpenModal(false); resetForm(); }}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSubmit} disabled={loading}>
            {editingUni ? "Update" : "Save"}
          </Button>,
        ]}
      >
        <div className="form-left">
          <label>Name *</label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <label>Location</label>
          <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          <label>Phone</label>
          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}




// import React, { useState, useEffect } from "react";
// import { Pagination, Modal, Button, Input, Spin } from "antd";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "./universityDash.css";

// const BASE_URL = process.env.REACT_APP_API_URL;

// function UniversityDashboard() {
//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingUni, setEditingUni] = useState(null);
//   const [filter, setFilter] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     location: "",
//     phone: "",
//   });

//   const capitalizeFirstLetter = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

//   // Fetch universities
//   const fetchUniversities = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/api/universities`);
//       setUniversities(Array.isArray(res.data) ? res.data : res.data.universities || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       Swal.fire("Error", "Failed to fetch universities", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   const resetForm = () => {
//     setFormData({ name: "", location: "", phone: "" });
//     setEditingUni(null);
//   };

//   const handleSubmit = async () => {
//     if (!formData.name.trim()) {
//       Swal.fire("Validation", "Name is required!", "warning");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       const payload = {
//         name: capitalizeFirstLetter(formData.name.trim()),
//         location: formData.location?.trim() || "",
//         phone: formData.phone?.trim() || "",
//       };

//       const response = editingUni
//         ? await axios.put(`${BASE_URL}/api/universities/${editingUni._id}`, payload, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         : await axios.post(`${BASE_URL}/api/universities`, payload, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//       setUniversities((prev) =>
//         editingUni
//           ? prev.map((u) => (u._id === editingUni._id ? response.data : u))
//           : [...prev, response.data]
//       );

//       Swal.fire("Success", editingUni ? "University updated!" : "University added!", "success");
//       setOpenModal(false);
//       resetForm();
//     } catch (err) {
//       console.error("Submit error:", err.response?.data || err);
//       Swal.fire("Error", editingUni ? "Failed to update university" : "Failed to add university", "error");
//     }
//   };

//   const handleDelete = async (uniId) => {
//   const confirm = await Swal.fire({
//     title: "Are you sure?",
//     text: "This will permanently delete the university!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Yes, delete it!",
//     cancelButtonText: "Cancel",
//   });

//   if (confirm.isConfirmed) {
//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.delete(`${BASE_URL}/api/universities/${uniId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setUniversities((prev) => prev.filter((u) => u._id !== uniId));
//       Swal.fire("Deleted!", "University has been deleted.", "success");
//     } catch (err) {
//       console.error("Delete error:", err.response?.data || err);
//       Swal.fire("Error", err.response?.data?.message || "Failed to delete university", "error");
//     }
//   }
// };


//   const handleEditClick = (uni) => {
//     setEditingUni(uni);
//     setFormData({
//       name: uni.name || "",
//       location: uni.location || "",
//       phone: uni.phone || "",
//     });
//     setOpenModal(true);
//   };

//   const filteredUniversities = universities.filter((u) =>
//     u.name?.toLowerCase().includes(filter.toLowerCase())
//   );

//   return (
//     <div className="dash-main">
//       <h2>Universities List</h2>

//       <div className="add-button">
//         <Button type="primary" onClick={() => setOpenModal(true)}>Add University</Button>
//         <Input
//           placeholder="Search by university name"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           style={{ marginLeft: 10, width: 250 }}
//         />
//       </div>

//       {loading ? (
//         <div style={{ textAlign: "center", marginTop: 50 }}>
//           <Spin size="large" />
//         </div>
//       ) : (
//         <div className="table-fixing">
//           {filteredUniversities.length === 0 ? (
//             <p>No universities found.</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Location</th>
//                   <th>Phone</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUniversities.map((uni) => (
//                   <tr key={uni._id}>
//                     <td>{uni.name}</td>
//                     <td>{uni.location || "-"}</td>
//                     <td>{uni.phone || "-"}</td>
//                     <td>
//                       <Button onClick={() => handleEditClick(uni)}>Edit</Button>
//                       <Button
//                         danger
//                         style={{ marginLeft: 5 }}
//                         onClick={() => handleDelete(uni._id)}
//                       >
//                         Delete
//                       </Button>

//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//           <Pagination
//             onChange={setCurrentPage}
//             current={currentPage}
//             total={filteredUniversities.length}
//           />
//         </div>
//       )}

//       <Modal
//         title={editingUni ? "Edit University" : "Add University"}
//         open={openModal}
//         onCancel={() => { setOpenModal(false); resetForm(); }}
//         width={600}
//         footer={[
//           <Button key="cancel" onClick={() => { setOpenModal(false); resetForm(); }}>Cancel</Button>,
//           <Button key="save" type="primary" onClick={handleSubmit}>
//             {editingUni ? "Update" : "Save"}
//           </Button>,
//         ]}
//       >
//         <div className="form-left">
//           <label>Name *</label>
//           <Input
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: capitalizeFirstLetter(e.target.value) })}
//           />
//           <label>Location</label>
//           <Input
//             value={formData.location}
//             onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//           />
//           <label>Phone</label>
//           <Input
//             value={formData.phone}
//             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//           />
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default UniversityDashboard;



