import { useOutletContext } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Pagination, Button, message } from "antd";
import axios from "axios";
import Loader from "../load/load.jsx";
import "./UsersTable.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function UsersTable() {
  const { currentUser } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/users?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setUsers(res.data.users || []);
      setTotalUsers(res.data.total || 0);
    } catch (err) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers(currentPage);
    }
  }, [currentUser, currentPage]);

  if (!currentUser || currentUser.role !== "admin") {
    return <p>You are not authorized to view this page.</p>;
  }

  const handleDelete = async (id, role) => {
    if (role !== "student") {
      return message.warning("You can only delete student users");
    }
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      message.success("Student deleted successfully");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.error || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Filter by ID, email, role, or agreedToTerms status
  const filteredUsers = users.filter((u) =>
    [u.userId, u.email, u.role, u.agreedToTerms ? "agreed" : "not agreed"].some((field) =>
      field?.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="dash-main">
          <h2>Users List</h2>
          <input
            type="text"
            placeholder="Search by ID, email, role, or consent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <div className="table-fixing">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Agreed to Terms</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.userId}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.agreedToTerms ? "✅ Yes" : "❌ No"}</td>
                    <td>
                      {user.role === "student" && (
                        <Button
                          danger
                          onClick={() => handleDelete(user._id, user.role)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              current={currentPage}
              total={totalUsers}
              pageSize={10}
              onChange={(page) => setCurrentPage(page)}
              showQuickJumper
              itemRender={(page, type) => {
                if (type === "prev") return <a>←</a>;
                if (type === "next") return <a>→</a>;
                return page;
              }}
              style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default UsersTable;
