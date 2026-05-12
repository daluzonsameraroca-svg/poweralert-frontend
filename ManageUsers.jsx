import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await api.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    }
  }

  async function updateRole(id, role) {
    try {
      const res = await api.put(`/users/${id}/role`, { role });
      alert(res.data.message || "User role updated.");
      loadUsers();
    } catch {
      alert("Failed to update role.");
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    try {
      const res = await api.delete(`/users/${id}`);
      alert(res.data.message || "User deleted.");
      loadUsers();
    } catch {
      alert("Failed to delete user.");
    }
  }

  const filtered = users.filter((user) => {
    const text = `
      ${user.first_name || ""}
      ${user.last_name || ""}
      ${user.email || ""}
      ${user.role || ""}
      ${user.municipality || ""}
      ${user.barangay || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <>
      <PageHeader
        title="Manage Users"
        subtitle="View consumers, update roles, and manage registered accounts."
      />

      <Card title="Search Users">
        <input
          placeholder="Search by name, email, role, or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {filtered.length === 0 ? (
        <Card title="No Users">
          <p>No users found.</p>
        </Card>
      ) : (
        filtered.map((user) => (
          <Card key={user.user_id} title={`${user.first_name} ${user.last_name}`}>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Area:</strong> {user.municipality || "N/A"},{" "}
              {user.barangay || "N/A"}
            </p>

            <StatusBadge status={user.role} />

            <div className="admin-actions">
              <select
                value={user.role || "user"}
                onChange={(e) => updateRole(user.user_id, e.target.value)}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>

              <button
                type="button"
                className="danger-btn"
                onClick={() => deleteUser(user.user_id)}
              >
                Delete
              </button>
            </div>
          </Card>
        ))
      )}
    </>
  );
}