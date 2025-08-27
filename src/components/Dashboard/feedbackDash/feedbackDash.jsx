import React, { useState, useEffect, useRef } from "react";
import { Table, Pagination, Modal, Button, Tag, Input, Select, Spin, Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import StarRating from "../../starRating/StarRating.jsx";
import PerformanceSection from "../../myRatings/PerformanceSection.jsx";
import "./feedbackDash.css";

const BASE_URL = process.env.REACT_APP_API_URL;
const { Option } = Select;

const DoctorFeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [doctorAvgStars, setDoctorAvgStars] = useState(new Map());
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("authToken");
  const alertShownRef = useRef(false); // guard for repeated Swal

  // --- get current user (from localStorage if available, else try /api/auth/me) ---
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setCurrentUser(JSON.parse(stored));
          return;
        }
        if (!token) return;
        // try fetch profile (optional, if your backend exposes such endpoint)
        const { data } = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(data);
      } catch (err) {
        // ignore - simply no current user info available
        console.warn("Could not load current user info:", err?.message || err);
      }
    };
    loadUser();
  }, [token]);

  // --- Fetch feedbacks + average ratings ---
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [feedbackRes, avgRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/ratings`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/ratings/average-ratings`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const feedbacksData = Array.isArray(feedbackRes.data) ? feedbackRes.data : [];
        setFeedbacks(feedbacksData);
        setPagination(prev => ({ ...prev, total: feedbacksData.length }));

        const avgMap = new Map();
        if (Array.isArray(avgRes.data)) {
          avgRes.data.forEach(item => {
            // item._id might be an ObjectId-like or string; use as-is
            avgMap.set(String(item._id), { avgStars: item.avgStars || 0, count: item.count || 0 });
          });
        }
        setDoctorAvgStars(avgMap);
      } catch (err) {
        console.error("Error fetching feedbacks or averages:", err);
        Swal.fire("Error", "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // you might want to poll periodically or refresh on actions
  }, [token]);

  // --- notify admin about flagged comments (only for admin)
  const flaggedCount = feedbacks.filter(f => !!f.containsBadWords).length;
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser?.role === 'admin' && flaggedCount > 0 && !alertShownRef.current) {
      alertShownRef.current = true;
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        html: `هناك ${flaggedCount} تعليق${flaggedCount > 1 ? 'ات' : ''} تحتوي كلمات غير لائقة. راجعها.`,
        timer: 5000
      });
    }
    // reset alertShownRef if flaggedCount becomes zero so future flags can show again:
    if (flaggedCount === 0) alertShownRef.current = false;
  }, [flaggedCount, currentUser]);

  const updateFeedbackStatus = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}/api/ratings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks((prev) => prev.map((f) => (f._id === id ? { ...f, status } : f)));
      Swal.fire("Success", `Status set to ${status}`, "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", `Failed to ${status}`, "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be removed",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/ratings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      Swal.fire("Deleted!", "Feedback has been removed.", "success");
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete feedback", "error");
    }
  };

  // --- Filter Feedbacks (safe checks) ---
  const filteredFeedbacks = feedbacks.filter((f) => {
    const text = (filterText || "").trim().toLowerCase();
    if (!text) {
      // filter by status only
      return filterStatus ? f.status === filterStatus : true;
    }

    const doctorName = (f.doctorId?.name || "").toLowerCase();
    const doctorEmail = (f.doctorId?.email || "").toLowerCase();
    const userName = (f.userId?.name || "").toLowerCase();
    const userEmail = (f.userId?.email || "").toLowerCase();

    const textMatch =
      doctorName.includes(text) ||
      doctorEmail.includes(text) ||
      userName.includes(text) ||
      userEmail.includes(text);

    const statusMatch = filterStatus ? f.status === filterStatus : true;
    return textMatch && statusMatch;
  });

  const handleTableChange = (pag) => setPagination(pag);

  const columns = [
    {
      title: "Student",
      dataIndex: ["userId", "name"],
      key: "student",
      render: (_, record) => record.userId?.name || record.userId?.email || "Unknown",
    },
    {
      title: "Doctor",
      dataIndex: ["doctorId", "name"],
      key: "doctor",
      render: (_, record) => record.doctorId?.name || record.doctorId?.email || "Unknown",
    },
    {
      title: "Average Rating",
      key: "avgRating",
      render: (_, record) => {
        const docId = String(record.doctorId?._id || "");
        const avgData = doctorAvgStars.get(docId) || { avgStars: 0, count: 0 };
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <StarRating rating={avgData.avgStars} editable={false} size={16} />
            <span style={{ fontSize: 12, color: "#555" }}>
              {Number(avgData.avgStars || 0).toFixed(1)} ({avgData.count})
            </span>
          </div>
        );
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const color = record.status === "flagged" ? "red" : (record.status === "approved" ? "green" : "orange");
        return <Tag color={color}>{record.status || "pending"}</Tag>;
      }
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (_, record) => new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => { setSelectedFeedback(record); setModalOpen(true); }}>
              View
            </Menu.Item>
            <Menu.Item key="approve" onClick={() => updateFeedbackStatus(record._id, "approved")}>
              Approve
            </Menu.Item>
            <Menu.Item key="flag" onClick={() => updateFeedbackStatus(record._id, "flagged")}>
              Flag
            </Menu.Item>
            <Menu.Item key="delete" danger onClick={() => handleDelete(record._id)}>
              Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  if (loading) return <Spin tip="Loading feedbacks..." style={{ marginTop: 50 }} />;

  return (
    <div className="dash-main" style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <h2>Doctor Feedback Dashboard</h2>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search doctor or student"
          value={filterText}
          onChange={(e) => { setFilterText(e.target.value); setPagination((prev) => ({ ...prev, current: 1 })); }}
          style={{ width: 300, marginRight: 10 }}
        />
        <Select
          placeholder="Filter by status"
          value={filterStatus}
          onChange={(val) => setFilterStatus(val)}
          allowClear
          style={{ width: 160 }}
        >
          <Option value="approved">Approved</Option>
          <Option value="flagged">Flagged</Option>
          <Option value="pending">Pending</Option>
        </Select>
      </div>

      {/* Table */}
      <div style={{ overflowY: "auto", minHeight: "210px" }}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredFeedbacks.slice(
            (pagination.current - 1) * pagination.pageSize,
            pagination.current * pagination.pageSize
          )}
          pagination={false}
          locale={{ emptyText: "No feedback found." }}
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={filteredFeedbacks.length}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
        />
      </div>

      {/* Modal */}
      <Modal
        title="Feedback Details"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[<Button key="close" onClick={() => setModalOpen(false)}>Close</Button>]}
        width={700}
      >
        {selectedFeedback && (
          <>
            <p><strong>Student:</strong> {selectedFeedback.userId?.email || selectedFeedback.userId?.name || "Unknown"}</p>
            <p><strong>Doctor:</strong> {selectedFeedback.doctorId?.name || selectedFeedback.doctorId?.email || "Unknown"}</p>

            <p><strong>Comment (clean):</strong> {selectedFeedback.additionalFeedback || "No comment"}</p>

            { currentUser?.role === 'admin' && (
              <div style={{ marginTop: 8 }}>
                <strong>Raw Comment (admin only):</strong>
                <div style={{ whiteSpace: 'pre-wrap', background:'#fff3f3', padding:8, borderRadius:4 }}>
                  {selectedFeedback.rawFeedback || '—'}
                </div>
              </div>
            )}

            <p>
              <strong>Status:</strong>{" "}
              <Tag color={selectedFeedback.status === "flagged" ? "red" : (selectedFeedback.status === "approved" ? "green" : "orange")}>
                {selectedFeedback.status || "pending"}
              </Tag>
            </p>

            <p><strong>Date:</strong> {new Date(selectedFeedback.createdAt).toLocaleString()}</p>
            <PerformanceSection
              ratings={{
                communication: selectedFeedback.communication,
                support: selectedFeedback.support,
                guidance: selectedFeedback.guidance,
                availability: selectedFeedback.availability,
              }}
              hideTitle={false}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default DoctorFeedbackDashboard;


// import React, { useState, useEffect } from "react";
// import { Table, Pagination, Modal, Button, Tag, Input, Select, Space, Spin, Dropdown, Menu } from "antd";
// import { EllipsisOutlined } from "@ant-design/icons";
// import axios from "axios";
// import Swal from "sweetalert2";
// import StarRating from "../../starRating/StarRating.jsx";
// import PerformanceSection from "../../myRatings/PerformanceSection.jsx";
// import "./feedbackDash.css";

// const BASE_URL = process.env.REACT_APP_API_URL;
// const { Option } = Select;

// const DoctorFeedbackDashboard = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [filterText, setFilterText] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
//   const [doctorStars, setDoctorStars] = useState({});
//   const [doctorAvgStars, setDoctorAvgStars] = useState({});
//   const token = localStorage.getItem("authToken");
//   const flaggedUsers = feedbacks.filter(f => f.userId?.warningCount >= 3);



//   if (flaggedUsers.length > 0) {
//   Swal.fire({
//     icon: 'warning',
//     title: 'Warning!',
//     html: `The following users have multiple warnings:<br>${flaggedUsers.map(u => u.userId.name).join('<br>')}`,
//   });
// }



//   // --- Fetch Feedbacks ---
//   // const fetchFeedbacks = async () => {
//   //   if (!token) return setLoading(false);
//   //   try {
//   //     setLoading(true);
//   //     const { data } = await axios.get(`${BASE_URL}/api/ratings`, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });

//   //     setFeedbacks(data || []);
//   //     setPagination((prev) => ({ ...prev, total: data.length }));

//   //     // Populate doctorStars directly from feedbacks
//   //     const starsObj = {};
//   //     data.forEach((fb) => {
//   //       const docId = fb.doctorId?._id || fb.doctorId?.id;
//   //       if (!docId) return;
//   //       starsObj[docId] = fb.stars ?? 0;
//   //     });
//   //     setDoctorStars(starsObj);
//   //   } catch (err) {
//   //     console.error("Error fetching feedbacks:", err);
//   //     Swal.fire("Error", "Failed to load feedbacks", "error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };





//   // useEffect(() => {
//   //   fetchFeedbacks();
//   // }, []);

//   // --- Update Feedback Status ---


// useEffect(() => {
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [feedbackRes, avgRes] = await Promise.all([
//         axios.get(`${BASE_URL}/api/ratings`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${BASE_URL}/api/ratings/average-ratings`, { headers: { Authorization: `Bearer ${token}` } })
//       ]);

//       const feedbacksData = feedbackRes.data || [];
//       setFeedbacks(feedbacksData);
//       setPagination(prev => ({ ...prev, total: feedbacksData.length }));

//       // Map doctorId to { avgStars, count }
//       const avgMap = new Map();
//       avgRes.data.forEach(item => {
//         avgMap.set(item._id, { avgStars: item.avgStars, count: item.count });
//       });
//       setDoctorAvgStars(avgMap);
//     } catch (err) {
//       console.error("Error fetching feedbacks or averages:", err);
//       Swal.fire("Error", "Failed to load data", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);


//   const updateFeedbackStatus = async (id, status) => {
//     try {
//       await axios.put(
//         `${BASE_URL}/api/ratings/${id}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFeedbacks((prev) =>
//         prev.map((f) => (f._id === id ? { ...f, status } : f))
//       );
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", `Failed to ${status}`, "error");
//     }
//   };

//   // --- Delete Feedback ---
//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: "This feedback will be removed",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (!confirm.isConfirmed) return;

//     try {
//       await axios.delete(`${BASE_URL}/api/ratings/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFeedbacks((prev) => prev.filter((f) => f._id !== id));
//       Swal.fire("Deleted!", "Feedback has been removed.", "success");
//       setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to delete feedback", "error");
//     }
//   };

//   // --- Filter Feedbacks ---
//  const filteredFeedbacks = feedbacks.filter((f) => {
//   const text = filterText.toLowerCase();
//   const textMatch =
//     f.doctorId?.name?.toLowerCase().includes(text) ||
//     f.doctorId?.email?.toLowerCase().includes(text) ||
//     f.userId?.name?.toLowerCase().includes(text) ||
//     f.userId?.email?.toLowerCase().includes(text);

//   const statusMatch = filterStatus ? f.status === filterStatus : true;
//   return textMatch && statusMatch;
// });


//   const handleTableChange = (pag) => setPagination(pag);

//   // --- Table Columns ---
//   const columns = [
//     {
//       title: "Student",
//       dataIndex: ["userId", "name"],
//       key: "student",
//       render: (_, record) => record.userId?.name || record.userId?.email || "Unknown",
//     },
//     {
//       title: "Doctor",
//       dataIndex: ["doctorId", "name"],
//       key: "doctor",
//       render: (_, record) => record.doctorId?.name || record.doctorId?.email || "Unknown",
//     },
//     {
//         title: "Average Rating",
//         key: "avgRating",
//         render: (_, record) => {
//           const docId = record.doctorId?._id;
//           const avgData = doctorAvgStars.get(docId) || { avgStars: 0, count: 0 };
//           return (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <StarRating rating={avgData.avgStars} editable={false} size={16} />
//               <span style={{ fontSize: 12, color: "#555" }}>
//                 {avgData.avgStars.toFixed(1)} ({avgData.count})
//               </span>
//             </div>
//           );
//         }
//       },
//       {
//         title: "Status",
//         dataIndex: "status",
//         key: "status",
//         render: (_, record) => {
//           const color = record.status === "flagged" ? "red" : "green";
//           return <Tag color={color}>{record.status || "pending"}</Tag>;
//         }
//       },
//     {
//       title: "Date",
//       dataIndex: "createdAt",
//       key: "date",
//       render: (_, record) => new Date(record.createdAt).toLocaleDateString(),
//     },
//       {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => {
//         const menu = (
//           <Menu>
//             <Menu.Item key="view" onClick={() => { setSelectedFeedback(record); setModalOpen(true); }}>
//               View
//             </Menu.Item>
//             <Menu.Item key="approve" onClick={() => updateFeedbackStatus(record._id, "approved")}>
//               Approve
//             </Menu.Item>
//             <Menu.Item key="flag" onClick={() => updateFeedbackStatus(record._id, "flagged")}>
//               Flag
//             </Menu.Item>
//             <Menu.Item key="delete" danger onClick={() => handleDelete(record._id)}>
//               Delete
//             </Menu.Item>
//           </Menu>
//         );

//         return (
//           <Dropdown overlay={menu} trigger={['click']}>
//             <Button icon={<EllipsisOutlined />} />
//           </Dropdown>
//         );
//       },
//     },
//   ];

//   if (loading) return <Spin tip="Loading feedbacks..." style={{ marginTop: 50 }} />;

//   return (
//     <div className="dash-main" style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
//       <h2>Doctor Feedback Dashboard</h2>

//       {/* Filters */}
//       <div className="filters" style={{ marginBottom: 16 }}>
//         <Input
//           placeholder="Search doctor or student"
//           value={filterText}
//           onChange={(e) => { setFilterText(e.target.value); setPagination((prev) => ({ ...prev, current: 1 })); }}
//           style={{ width: 250, marginRight: 10 }}
//         />
//         <Select
//           placeholder="Filter by status"
//           value={filterStatus}
//           onChange={(val) => setFilterStatus(val)}
//           allowClear
//         >
//           <Option value="approved">Approved</Option>
//           <Option value="flagged">Flagged</Option>
//         </Select>

//       </div>

//       {/* Table */}
//       <div style={{ overflowY: "auto", minHeight: "210px" }}>
//         <Table
//           rowKey="_id"
//           columns={columns}
//           dataSource={filteredFeedbacks.slice(
//             (pagination.current - 1) * pagination.pageSize,
//             pagination.current * pagination.pageSize
//           )}
//           pagination={false}
//           locale={{ emptyText: "No feedback found." }}
//           scroll={{ x: "max-content" }}
//         />
//       </div>

//       {/* Pagination */}
//       <div style={{ display: "flex", justifyContent: "center", marginTop:0 }}>
//         <Pagination
//           current={pagination.current}
//           pageSize={pagination.pageSize}
//           total={filteredFeedbacks.length}
//           showSizeChanger
//           pageSizeOptions={["5", "10", "20", "50"]}
//           onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
//         />
//       </div>

//       {/* Modal */}
//       <Modal
//         title="Feedback Details"
//         open={modalOpen}
//         onCancel={() => setModalOpen(false)}
//         footer={[<Button key="close" onClick={() => setModalOpen(false)}>Close</Button>]}
//         width={700}
//       >
//         {selectedFeedback && (
//           <>
//             <p><strong>Student:</strong> {selectedFeedback.userId?.email || "Unknown"}</p>
//             <p><strong>Doctor:</strong> {selectedFeedback.doctorId?.name || "Unknown"}</p>
//             <p><strong>Comment:</strong> {selectedFeedback.additionalFeedback || "No comment"}</p>
//             <p>
//               <strong>Status:</strong>{" "}
//               <Tag color={selectedFeedback.status === "flagged" ? "red" : "green"}>
//                 {selectedFeedback.status || "pending"}
//               </Tag>
//             </p>

//             <p><strong>Date:</strong> {new Date(selectedFeedback.createdAt).toLocaleString()}</p>
//             <PerformanceSection
//               ratings={{
//                 communication: selectedFeedback.communication,
//                 support: selectedFeedback.support,
//                 guidance: selectedFeedback.guidance,
//                 availability: selectedFeedback.availability,
//               }}
//               hideTitle={false}
//             />
//           </>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default DoctorFeedbackDashboard;
