import React, { useState, useEffect } from "react";
import { Pagination, Modal, Button, Tag, Input, Select } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../load/load.jsx";
import "./feedbackDash.css";

const BASE_URL = process.env.REACT_APP_API_URL;
const { Option } = Select;

function DoctorFeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/feedbacks`);
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This comment will be removed",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });
      if (confirm.isConfirmed) {
        await axios.delete(`${BASE_URL}/api/feedbacks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        Swal.fire("Deleted!", "Comment has been removed.", "success");
        fetchFeedbacks();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete comment", "error");
    }
  };

  const filteredFeedbacks = feedbacks.filter(
    (fb) =>
      fb.doctorName?.toLowerCase().includes(filterText.toLowerCase()) ||
      fb.userName?.toLowerCase().includes(filterText.toLowerCase())
  ).filter((fb) => (filterStatus ? fb.status === filterStatus : true));

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="dash-main">
          <h2>Doctor Feedback</h2>

          <div className="filters">
            <Input
              placeholder="Search by doctor or student"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ width: 250, marginRight: 10 }}
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              style={{ width: 180 }}
              allowClear
            >
              <Option value="approved">Approved</Option>
              <Option value="flagged">Flagged</Option>
            </Select>
          </div>

          <div className="table-fixing">
            {filteredFeedbacks.length === 0 ? (
              <p>No feedback found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Doctor</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedbacks.map((fb) => (
                    <tr key={fb._id}>
                      <td>{fb.userName}</td>
                      <td>{fb.doctorName}</td>
                      <td>{fb.rating} ⭐</td>
                      <td>
                        {fb.comment.length > 30
                          ? fb.comment.substring(0, 30) + "..."
                          : fb.comment}
                      </td>
                      <td>
                        <Tag color={fb.status === "flagged" ? "red" : "green"}>
                          {fb.status}
                        </Tag>
                      </td>
                      <td>{new Date(fb.date).toLocaleDateString()}</td>
                      <td>
                        <Button
                          onClick={() => {
                            setSelectedFeedback(fb);
                            setOpenModal(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          danger
                          onClick={() => handleDelete(fb._id)}
                          style={{ marginLeft: 8 }}
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
              total={filteredFeedbacks.length}
              pageSize={10}
            />
          </div>

          {/* Modal to view details */}
          <Modal
            title="Feedback Details"
            open={openModal}
            onCancel={() => setOpenModal(false)}
            footer={[
              <Button key="close" onClick={() => setOpenModal(false)}>
                Close
              </Button>,
            ]}
          >
            {selectedFeedback && (
              <div>
                <p><strong>Student:</strong> {selectedFeedback.userName}</p>
                <p><strong>Doctor:</strong> {selectedFeedback.doctorName}</p>
                <p><strong>Rating:</strong> {selectedFeedback.rating} ⭐</p>
                <p><strong>Comment:</strong> {selectedFeedback.comment}</p>
                <p><strong>Status:</strong> {selectedFeedback.status}</p>
                <p><strong>Date:</strong> {new Date(selectedFeedback.date).toLocaleString()}</p>
              </div>
            )}
          </Modal>
        </div>
      )}
    </>
  );
}

export default DoctorFeedbackDashboard;
