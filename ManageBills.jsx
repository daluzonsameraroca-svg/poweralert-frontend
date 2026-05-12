import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { createBill, getAllBills } from "../../api/billApi";
import Toast from "../../components/common/Toast";

export default function ManageBills() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    user_id: "",
    billing_month: "",
    amount: "",
    due_date: "",
  });

  useEffect(() => {
    loadBills();
  }, []);

  async function loadBills() {
    try {
      const res = await getAllBills();
      setBills(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Failed to load bills", error);
      setBills([]);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await createBill(form);

      if (res.data.status === "success") {
        setMessage(res.data.message || "Bill added successfully.");
        setForm({
          user_id: "",
          billing_month: "",
          amount: "",
          due_date: "",
        });
        loadBills();
      } else {
        setMessage(res.data.message || "Failed to add bill.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add bill.");
    }
  }

  const filteredBills = bills.filter((bill) => {
    const text = `
      ${bill.first_name || ""}
      ${bill.last_name || ""}
      ${bill.email || ""}
      ${bill.billing_month || ""}
      ${bill.amount || ""}
      ${bill.status || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <>
      <PageHeader
        title="Manage Bills"
        subtitle="Create consumer bills and notify users about new payments."
      />

      <Card title="Add New Bill">
        {message && <div className="auth-message">{message}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="user_id"
            placeholder="Consumer User ID"
            value={form.user_id}
            onChange={handleChange}
            required
          />

          <input
            name="billing_month"
            placeholder="Billing Month e.g. May 2026"
            value={form.billing_month}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            required
          />

          <button type="submit">Add Bill and Notify User</button>
        </form>
      </Card>

      <Card title="Search Bills">
        <input
          placeholder="Search consumer, email, billing month, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {filteredBills.length === 0 ? (
        <Card title="No Bills">
          <p>No bills found.</p>
        </Card>
      ) : (
        filteredBills.map((bill) => (
          <Card key={bill.bill_id} title={`${bill.billing_month} Bill`}>
            <p>
              <strong>Consumer:</strong> {bill.first_name} {bill.last_name}
            </p>

            <p>
              <strong>Email:</strong> {bill.email}
            </p>

            <p>
              <strong>Amount:</strong> ₱{bill.amount}
            </p>

            <p>
              <strong>Due Date:</strong> {bill.due_date}
            </p>

            <StatusBadge status={bill.status} />
          </Card>
        ))
      )}
    </>
  );
}