import { useOutletContext } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Pagination, Button, Modal, message, Input } from "antd";
import axios from "axios";
import Loader from "../../../layouts/load/load.jsx";

const BASE_URL = process.env.REACT_APP_API_URL;

function AdminTable() {
  const { currentUser } = useOutletContext();
  const [admins, setAdmins] = useState([]);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({ email: "", password: "" });

  const token = currentUser?.token;
  const role = currentUser?.role;


  // -----------------------------
  // Fetch admins (with optional filter & pagination)
  // -----------------------------
  const fetchAdmins = async (page = currentPage, filterText = filter) => {
    if (!token || role !== "admin") return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admins?page=${page}&filter=${filterText}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(res.data.users || []);
      setTotalAdmins(res.data.total || 0);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [token, role, currentPage, filter]);


  if (!currentUser) return <Loader />;
  if (role !== "admin") return <p>You are not authorized to view this page.</p>;

  // -----------------------------
  // Modal handlers
  // -----------------------------
  const showModal = (admin = null) => {
    if (admin) {
      setIsEditing(true);
      setEditingAdmin(admin);
      setForm({ email: admin.email, password: "" });
    } else {
      setIsEditing(false);
      setEditingAdmin(null);
      setForm({ email: "", password: "" });
    }
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEditingAdmin(null);
    setForm({ email: "", password: "" });
  };

  // -----------------------------
  // Frontend validation
  // -----------------------------
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!form.email || !emailRegex.test(form.email)) {
      message.warning("Enter a valid email");
      return false;
    }

    if (!isEditing && (!form.password || !passwordRegex.test(form.password))) {
      message.warning(
        "Password must be at least 6 chars, include uppercase, lowercase, number, and special character"
      );
      return false;
    }

    return true;
  };

  // -----------------------------
  // Add or Edit Admin
  // -----------------------------
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = { email: form.email, password: form.password };
      if (isEditing) {
        if (editingAdmin.role === "superadmin") {
          return message.warning("Cannot edit superadmin");
        }
        await axios.put(`${BASE_URL}/api/admins/${editingAdmin._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Admin updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/admins`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Admin added. Verification email sent.");
      }
      fetchAdmins();
      handleCancel();
    } catch (err) {
      console.error(err.response || err);
      message.error(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Delete admin
  // -----------------------------
  const handleDelete = async (user) => {
    if (user._id === currentUser._id) {
      return message.warning("You cannot delete yourself!");
    }
    if (user.role === "admin" || user.role === "superadmin") {
      return message.warning("Cannot delete admin users!");
    }
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User deleted successfully");
      fetchAdmins();
    } catch (err) {
      console.error(err.response || err);
      message.error(err.response?.data?.error || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Filter admins
  // -----------------------------
  const filteredAdmins = admins.filter((admin) =>
    [admin.email, admin.role].some((field) =>
      field?.toLowerCase().includes(filter.toLowerCase())
    )
  );

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <>
      {loading && <Loader />}
      <div className="dash-main">
        <h2>Admins List</h2>

        <div className="add-button" style={{ marginBottom: 20 }}>
          <Button type="primary" onClick={() => showModal()}>
            Add Admin
          </Button>
          <Input
            placeholder="Search by email or role"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 250, marginLeft: 10 }}
          />
        </div>

        <Modal
          title={isEditing ? `Editing Admin: ${editingAdmin?.email}` : "Add Admin"}
          open={modalOpen}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="save" type="primary" onClick={handleSubmit}>
              Save
            </Button>,
          ]}
        >
          <div style={{ marginBottom: 10 }}>
            <label>Email:</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Password:</label>
            <Input.Password
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isEditing ? "Leave blank to keep current password" : ""}
            />
          </div>
        </Modal>

        <div className="table-fixing">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>
                  <td>
                    <Button onClick={() => showModal(admin)}>Edit</Button>
                    <Button
                      danger
                      onClick={() => handleDelete(admin)}
                      style={{ marginLeft: 5 }}
                      disabled={admin.role === "superadmin"}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            current={currentPage}
            total={totalAdmins}
            pageSize={10}
            onChange={(page) => setCurrentPage(page)}
            showQuickJumper
            style={{ marginTop: 20, textAlign: "center" }}
          />
        </div>
      </div>
    </>
  );
}

export default AdminTable;
