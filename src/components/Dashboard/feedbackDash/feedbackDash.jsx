import React, { useState, useEffect } from "react";
import { Table, Pagination, Modal, Button, Tag, Input, Select, Space, Spin } from "antd";
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

  const token = localStorage.getItem("authToken");

  // --- Fetch Feedbacks ---
  const fetchFeedbacks = async () => {
    if (!token) return setLoading(false);
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/ratings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedbacks(data || []);
      setPagination((prev) => ({ ...prev, total: data.length }));
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      Swal.fire("Error", "Failed to load feedbacks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // --- Actions ---
  const updateFeedbackStatus = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}/api/ratings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks((prev) =>
        prev.map((f) => (f._id === id ? { ...f, status } : f))
      );
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
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete feedback", "error");
    }
  };

  // --- Filter & Table Data ---
  const filteredFeedbacks = feedbacks.filter((f) => {
    const textMatch =
      f.doctorId?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      f.userId?.name?.toLowerCase().includes(filterText.toLowerCase());
    const statusMatch = filterStatus ? f.status === filterStatus : true;
    return textMatch && statusMatch;
  });

  const handleTableChange = (pag) => {
    setPagination(pag);
  };

  const columns = [
    {
      title: "Student",
      dataIndex: ["userId", "name"],
      key: "student",
      render: (_, record) =>
       record.userId?.name || record.userId?.email || "Unknown",
    },
    {
      title: "Doctor",
      dataIndex: ["doctorId", "name"],
      key: "doctor",
      render: (_, record) =>
      record.doctorId?.name || record.doctorId?.email || "Unknown",
    },
    {
      title: "Rating",
      dataIndex: "averageRating",
      key: "rating",
      render: (_, record) => <StarRating rating={record.averageRating || 0} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.status === "flagged" ? "red" : "green"}>
          {record.status || "pending"}
        </Tag>
      ),
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
      render: (_, record) => (
        <Space>
          <Button onClick={() => { setSelectedFeedback(record); setModalOpen(true); }}>
            View
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
          <Button type="primary" onClick={() => updateFeedbackStatus(record._id, "approved")}>Approve</Button>
          <Button danger onClick={() => updateFeedbackStatus(record._id, "flagged")}>Flag</Button>
        </Space>
      ),
    },
  ];

  if (loading) return <Spin tip="Loading feedbacks..." style={{ marginTop: 50 }} />;

  return (
  <div className="dash-main" style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
    <h2>Doctor Feedback Dashboard</h2>

    <div className="filters" style={{ marginBottom: 16 }}>
      <Input
        placeholder="Search doctor or student"
        value={filterText}
        onChange={(e) => {
          setFilterText(e.target.value);
          setPagination((prev) => ({ ...prev, current: 1 }));
        }}
        style={{ width: 250, marginRight: 10 }}
      />
      <Select
        placeholder="Filter by status"
        value={filterStatus}
        onChange={(val) => {
          setFilterStatus(val);
          setPagination((prev) => ({ ...prev, current: 1 }));
        }}
        style={{ width: 180 }}
        allowClear
      >
        <Option value="approved">Approved</Option>
        <Option value="flagged">Flagged</Option>
      </Select>
    </div>

    {/* Table wrapper */}
    <div style={{ flexGrow: 1, overflowY: "auto" }}>
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
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={filteredFeedbacks.length}
        showSizeChanger
        pageSizeOptions={["5", "10", "20", "50"]}
        onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
      />
    </div>

    {/* Modal stays inside the same parent */}
    <Modal
      title="Feedback Details"
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={[<Button key="close" onClick={() => setModalOpen(false)}>Close</Button>]}
      width={700}
    >
      {selectedFeedback && (
        <>
          <p><strong>Student:</strong> {selectedFeedback.userId?.name || "Unknown"}</p>
          <p><strong>Doctor:</strong> {selectedFeedback.doctorId?.name || "Unknown"}</p>
          <p><strong>Comment:</strong> {selectedFeedback.additionalFeedback || "No comment"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <Tag color={selectedFeedback.status === "flagged" ? "red" : "green"}>
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
