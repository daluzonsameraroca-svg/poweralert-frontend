import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { getUserBills, payBill } from "../../api/billApi";

export default function Bills() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bills, setBills] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBills();
  }, []);

  async function loadBills() {
    try {
      const res = await getUserBills(user.user_id);
      setBills(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Failed to load bills", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePayBill(id) {
    try {
      const res = await payBill(id);

      if (res.data.status === "success") {
        setReceipt(res.data);
        loadBills();
      } else {
        alert(res.data.message || "Payment failed.");
      }
    } catch (error) {
      alert("Failed to process payment.");
    }
  }

  return (
    <>
      <PageHeader
        title="Bills & Receipts"
        subtitle="View your bills, due dates, payment status, and generated receipts."
      />

      {loading ? (
        <Card title="Loading">
          <p>Loading bills...</p>
        </Card>
      ) : bills.length === 0 ? (
        <Card title="No Bills">
          <p>No bills found for your account.</p>
        </Card>
      ) : (
        bills.map((bill) => (
          <Card key={bill.bill_id} title={`${bill.billing_month} Bill`}>
            <p>
              <strong>Amount:</strong> ₱{bill.amount}
            </p>

            <p>
              <strong>Due Date:</strong> {bill.due_date}
            </p>

            <StatusBadge status={bill.status} />

            {bill.status !== "Paid" && (
              <div style={{ marginTop: "16px" }}>
                <button onClick={() => handlePayBill(bill.bill_id)}>
                  Pay / Generate Receipt
                </button>
              </div>
            )}
          </Card>
        ))
      )}

      {receipt && (
        <div className="modal-backdrop">
          <div className="receipt-modal">
            <h2>ElectroPulse</h2>
            <p className="receipt-subtitle">Payment Receipt</p>

            <hr />

            <p>
              <strong>Reference No:</strong> {receipt.reference_no}
            </p>

            <p>
              <strong>Consumer:</strong> {user.first_name} {user.last_name}
            </p>

            <p>
              <strong>Status:</strong> Payment Successful
            </p>

            <hr />

            <div className="modal-actions">
              <button onClick={() => window.print()}>Print</button>
              <button onClick={() => setReceipt(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}